import { buildOpenAIChatModel } from "@/app/llm/models/openai-model";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const stringOutputParser = new StringOutputParser();

const model = buildOpenAIChatModel("gpt-3.5-turbo-0125", "ask");

type FollowUpQuestionChainInput = {
	question: string;
	answer: string;
};
const prompt = ChatPromptTemplate.fromMessages<FollowUpQuestionChainInput>([
	[
		"system",
		"You are a professor, who needs to explain science to students who haven't been listening in school. You have to give them short questions. Here are some examples. There is one that is critical to the question, please mind that because that is an important question. What societal changes might accompany widespread EV adoption? What are the environmental concerns about battery production and their disposal? Can EVs overcome limitations like battery technology and charging time?",
	],
	["human", "{question}"],
	["assistant", "{answer}"],
	[
		"human",
		"Based on chat history provide three good follow-up questions that would help an adult learner dive a bit deeper and understand the background for this answer. Make the questions short, 10 words or less. Explain the 3 questions with one that dives deeper, one that challenges the facts and the last one to broaden the users knowledge. The professor avoids talking about why he asked that question, instead he only asks the question and not why. The professor avoids writing dives deeper, challenges the facts and broaden user knowledge because he wants to keep it smooth.",
	],
]);

export const getFollowUpQuestionChain = (
	modelOverride: BaseChatModel = model,
) =>
	prompt
		.pipe(modelOverride)
		.pipe(stringOutputParser)
		.pipe(sanitizeFollowups)
		.withConfig({ runName: "GenerateFollowUpQuestions" });

export const followUpQuestionChain = getFollowUpQuestionChain();

function sanitizeFollowups(input: string) {
	const sanitized = input
		// Filter out newlines, quotes and empty strings, trim, and remove duplicates
		.replaceAll('"', "")
		.replaceAll("?", "")
		.split("\n")
		.map((value) => value.replace(/^[^a-zA-Z]+|\W+$/g, ""))
		.join("?");

	return sanitized;
}
