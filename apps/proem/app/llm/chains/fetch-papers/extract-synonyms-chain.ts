import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableLambda, RunnableSequence } from "@langchain/core/runnables";
import { buildOpenAIChatModel } from "../../models/openai-model";
import * as hub from "langchain/hub";
import { OpenAlexQueryParams } from "./oa-search-helpers";
import { askOaBaseUrl } from "@/app/api/paper-search/search";

type Input = {
	question: string;
};
type SynonymGroups = string[][];

const prompt = await hub.pull("proemial/ask-oa-search-params:3c496731");

const model = buildOpenAIChatModel("gpt-3.5-turbo-0125", "ask", {
	temperature: 0.0,
	verbose: process.env.NODE_ENV === "development" ? true : false,
	cache: process.env.NODE_ENV === "development" ? false : true,
});

const runnable = prompt.pipe(model);

export const extractSynonymGroupsChain = () =>
	RunnableSequence.from<Input, SynonymGroups>([
		runnable,
		new StringOutputParser(),
		toSanitizedArray,
	]).withConfig({
		runName: "ExtractSynonymGroups",
	});

const toSanitizedArray = (str: string) => JSON.parse(str);

export const generateOpenAlexSearch = RunnableLambda.from<
	SynonymGroups,
	OpenAlexQueryParams & { link: string }
>(async (input) => {
	console.log("singularSynonyms", input, singularSynonyms(input.slice(0, -1)));

	return {
		// 0. Extract ordered synonym groups
		// 1. Use synonym groups in title and abstract
		// 2. Explode synonym groups in title
		// 3. Convert bi-grams to unigrams in title
		// 4. Gradually backwards collapse synonym groups in abstract
		searchQueries: [
			asUrl(synonymGroups(input), synonymGroups(input)),
			asUrl(singularSynonyms(input), synonymGroups(input)),
			asUrl(unigrams(input), synonymGroups(input)),
			asUrl(synonymGroups(input)),
			asUrl(singularSynonyms(input.slice(0, -1))),
		],
		link: `${askOaBaseUrl},$q`,
	};
}).withConfig({ runName: "GenerateOpenAlexSearch" });

function asUrl(title: string, abstract?: string) {
	return encodeURIComponent(
		`title.search:(${title})${
			abstract ? `,abstract.search:(${abstract})` : ""
		}`,
	);
}

// [[a, b], [c, d]] > "(a OR b) AND (c OR d)"
function synonymGroups(groups: SynonymGroups) {
	return groups
		.map(
			(synonyms) =>
				`(${synonyms.map((synonym) => `"${synonym}"`).join(" OR ")})`,
		)
		.join(" AND ");
}

// [[a, b], [c, d]] > "a OR b OR c OR d"
function singularSynonyms(groups: SynonymGroups) {
	return groups
		.map((synonyms) => synonyms.map((synonym) => `"${synonym}"`).join(" OR "))
		.join(" OR ");
}

// [["a aa", "b bb"], ["c cc", "d dd"]] > "a OR aa OR b OR bb OR c OR cc OR d OR dd"
function unigrams(groups: SynonymGroups) {
	return groups
		.map((synonyms) =>
			synonyms
				.map((synonym) =>
					synonym
						.split(" ")
						.map((word) => `"${word}"`)
						.join(" OR "),
				)
				.join(" OR "),
		)
		.join(" OR ");
}

export const searchSynonymsChain = extractSynonymGroupsChain().pipe(
	generateOpenAlexSearch,
);
