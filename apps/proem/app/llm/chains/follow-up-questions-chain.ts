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
		"You are a professor, who needs to explain science to students who haven't been listening in school. You have to give them short questions. Give them questions that range from 6 to 12 words. Here are some examples.1. How are EV's better than regular cars? 2. How are EV's made? 3. What is the difference between EV's and Hybrids? Return these as a comma separated string without any number prefixes.",
	],
	["human", "{question}"],
	["assistant", "{answer}"],
	[
		"human",
		"Based on chat history provide three good follow-up questions that would help an adult learner dive a bit deeper and understand the background for this answer. Make the questions short, less than ten words. Explain the 3 questions with one that dives deeper, one that challenges the facts and the last one to broaden the users knowledge. The professor avoids talking about why he asked that question, instead he only asks the question and not why",
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
