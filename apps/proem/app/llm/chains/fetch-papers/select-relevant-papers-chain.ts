import { Paper } from "@/app/api/paper-search/search";
import { buildOpenAIChatModel } from "@/app/llm/models/openai-model";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
	RunnablePassthrough,
	RunnableSequence,
} from "@langchain/core/runnables";

const selectRelevantPapersPromps = ChatPromptTemplate.fromMessages([
	// TODO! ask llm to select ID's with a reason why and a score
	[
		"system",
		"You are a scientist who is trying to find the 5 best scientific research papers that are related to the user's question. Only answer with papers given the user's question. ONLY respond with the id's of the most relevant papers in a comma separated list.",
	],
	[
		"human",
		"Which of these papers is most relevant to my question. <papers>{papers}</papers>. My question is <question>{question}</question>.",
	],
]);

const model = buildOpenAIChatModel("gpt-3.5-turbo-0125", "ask", {
	verbose: process.env.NODE_ENV === "development" ? true : false,
	cache: process.env.NODE_ENV === "development" ? false : true,
	temperature: 0,
});

export const getSelectRelevantPapersChain = (modelOverride: BaseChatModel) =>
	RunnableSequence.from<{
		papers: string;
		question: string;
	}>([
		(input) => {
			const papers = (JSON.parse(input.papers) as Paper[]).map((paper: {link: string}) => ({
				...paper,
				id: paper.link,
			}));
			console.log(papers)
			return {
				question: input.question,
				papers: input.papers,
			};
		},
		RunnablePassthrough.assign({
			selectedPapers: selectRelevantPapersPromps
				.pipe(modelOverride)
				.pipe(new StringOutputParser()),
		}),
		(input) => {
			// selectedPapers, papers, question
			console.log(input);
			return input.selectedPapers;
			// TODO! Make evaluator for this
		},
	]);

export const selectRelevantPapersChain = getSelectRelevantPapersChain(model);
