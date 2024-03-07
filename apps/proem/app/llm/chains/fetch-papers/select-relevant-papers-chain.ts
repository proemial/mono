import { Paper } from "@/app/api/paper-search/search";
import { mapPapersToIds } from "@/app/llm/evaluators/select-paper-evaluators";
import { buildOpenAIChatModel } from "@/app/llm/models/openai-model";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
	RunnablePassthrough,
	RunnableSequence,
} from "@langchain/core/runnables";

type SelectRelevantPapersPromptInput = {
	question: string;
	papersWithIds: string;
};

const selectRelevantPapersPrompt =
	ChatPromptTemplate.fromMessages<SelectRelevantPapersPromptInput>([
		// TODO! ask llm to select ID's with a reason why and a score
		[
			"system",
			"You are a scientist who is trying to find the 2 best scientific research papers that are related to the user's question. Only answer with papers given the user's question. ONLY respond with the id's of the most relevant papers in a comma separated list.",
		],
		[
			"human",
			"Which of these papers is most relevant to my question. <papers>{papersWithIds}</papers>. My question is <question>{question}</question>.",
		],
	]);

const model = buildOpenAIChatModel("gpt-3.5-turbo-0125", "ask", {
	verbose: process.env.NODE_ENV === "development" ? true : false,
	cache: process.env.NODE_ENV === "development" ? false : true,
	temperature: 0,
});

type SelectRelevantPapersChainInput = { question: string; papers: string };
type SelectRelevantPapersChainOutput = SelectRelevantPapersPromptInput & {
	selectedPaperIds: string[];
	selectedPapers: Paper[];
};

export const getSelectRelevantPapersChain = (modelOverride: BaseChatModel) =>
	RunnableSequence.from<
		SelectRelevantPapersChainInput,
		SelectRelevantPapersChainOutput
	>([
		RunnablePassthrough.assign({
			papersWithIds: (input) => JSON.stringify(mapPapersToIds(input.papers)),
		}),
		RunnablePassthrough.assign({
			selectedPaperIds: selectRelevantPapersPrompt
				.pipe(modelOverride)
				.pipe(new StringOutputParser())
				.pipe((selectedPaperIdsAsString) => {
					const selectedPaperIds =
						selectedPaperIdsAsString.split(",").map((str) => str.trim()) ?? [];
					return selectedPaperIds;
				}),
		}),
		(input) => {
			const papers = JSON.parse(input.papers);

			// const evaluation = PaperIdEvaluator.evaluate(
			// 	papers,
			// 	input.selectedPaperIds,
			// );

			const selectedPapers = papers.filter(
				({ link }: { link: `/oa/${string}` }) =>
					input.selectedPaperIds.some(
						(selectedPaperId: string) => `/oa/${selectedPaperId}` === link,
					),
			);

			return selectedPapers;
		},
	]).withConfig({ runName: "SelectRelevantPapers" });

export const selectRelevantPapersChain = getSelectRelevantPapersChain(model);
