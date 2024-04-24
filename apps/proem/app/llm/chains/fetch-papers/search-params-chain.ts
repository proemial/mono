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
import { Metrics } from "@/app/components/analytics/sentry/metrics";

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
	])
		.withConfig({
			runName: "ExtractSynonymGroups",
		})
		.withListeners({
			onEnd: (output) => {
				const elapsed =
					output?.end_time && output?.end_time - output.start_time;
				if (elapsed) {
					Metrics.elapsed(elapsed, "ask.papers.synonyms");
				}
			},
		});

const toSanitizedArray = (str: string) => JSON.parse(str.replace("\n", ""));

const generateOpenAlexSearch = RunnableLambda.from<
	SynonymGroups,
	OpenAlexQueryParams & { link: string }
>(async (input) => {
	return {
		searchQueries: {
			"1_sg_sg": asUrl(synonymGroups(input), synonymGroups(input)),
			"2_ssNv_sg": asUrl(singularSynonymsNoVerbs(input), synonymGroups(input)),
			"3_ssNv_sgX": asUrl(
				singularSynonymsNoVerbs(input),
				expandedSynonymGroups(input),
			),
			"4_uni_sgX": asUrl(uniqueUnigrams(input), expandedSynonymGroups(input)),
		},
		link: `${askOaBaseUrl},$q`,
	};
}).withConfig({ runName: "BuildOASearchString" });

export const searchParamsChain = extractSynonymGroupsChain().pipe(
	generateOpenAlexSearch,
);
