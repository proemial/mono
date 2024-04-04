import { askOaBaseUrl } from "@/app/api/paper-search/search";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableLambda, RunnableSequence } from "@langchain/core/runnables";
import * as hub from "langchain/hub";
import { buildOpenAIChatModel } from "../../models/openai-model";
import { OpenAlexQueryParams } from "./oa-search-helpers";
import {
	SynonymGroups,
	asUrl,
	expandedSynonymGroups,
	singularSynonymsNoVerbs,
	synonymGroups,
	uniqueUnigrams,
} from "./search-params-helpers";

type Input = {
	question: string;
};

const prompt = await hub.pull("proemial/ask-oa-search-params:975dc9f3");

const model = buildOpenAIChatModel("gpt-3.5-turbo-0125", "ask", {
	temperature: 0.0,
});

const runnable = prompt.pipe(model);

const extractSynonymGroupsChain = () =>
	RunnableSequence.from<Input, SynonymGroups>([
		runnable,
		new StringOutputParser(),
		toSanitizedArray,
	]).withConfig({
		runName: "ExtractSynonymGroups",
	});

const toSanitizedArray = (str: string) => JSON.parse(str);

const generateOpenAlexSearch = RunnableLambda.from<
	SynonymGroups,
	OpenAlexQueryParams & { link: string }
>(async (input) => {
	return {
		searchQueries: {
			"1:sg/sg": asUrl(synonymGroups(input), synonymGroups(input)),
			"2:ssNv/sg": asUrl(singularSynonymsNoVerbs(input), synonymGroups(input)),
			"3:ssNv/sgX": asUrl(
				singularSynonymsNoVerbs(input),
				expandedSynonymGroups(input),
			),
			"4:uni/sgX": asUrl(uniqueUnigrams(input), expandedSynonymGroups(input)),
		},
		link: `${askOaBaseUrl},$q`,
	};
}).withConfig({ runName: "BuildOASearchString" });

export const searchParamsChain = extractSynonymGroupsChain().pipe(
	generateOpenAlexSearch,
);
