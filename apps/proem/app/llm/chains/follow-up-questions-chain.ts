import { buildOpenAIChatModel } from "@/app/llm/models/openai-model";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const stringOutputParser = new StringOutputParser();

const model = buildOpenAIChatModel("gpt-3.5-turbo-0125", "ask", {
	verbose: process.env.NODE_ENV === "development" ? true : false,
	cache: process.env.NODE_ENV === "development" ? false : true,
});

type FollowUpQuestionChainInput = {
	question: string;
	answer: string;
};
const prompt = ChatPromptTemplate.fromMessages<FollowUpQuestionChainInput>([
	[
		"system",
		"You are an middle school teacher. Create great follow up question based on the prior conversation. Keep them REALLY short and precise with a clear language a 5 year old can understand. Return these as a comma separated string without any number prefixes.",
	],
	["human", "{question}"],
	["assistant", "{answer}"],
	[
		"human",
		"Provide two good follow-up questions that would help a young learner dive a bit deeper and understand the background for this answer. Make the questions short, less than ten words.",
	],
]);

export const getFollowUpQuestionChain = (
	modelOverride: BaseChatModel = model,
) =>
	prompt
		.pipe(modelOverride)
		.pipe(stringOutputParser)
		.withConfig({ runName: "GenerateFollowUpQuestions" });

export const followUpQuestionChain = getFollowUpQuestionChain();
