import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { buildOpenAIChatModel } from "../../models/openai-model";

type Input = {
	question: string;
};
type Output = string[];

const systemPrompt = `
Based on a given user question, for each of the key concepts and verbs in the
question respond with three closely related scientific concepts as well as three
synonyms. Both the scientific concepts and synonyms should preferably be
two-grams or longer.

Example:
User question: \`Does smoking cause lung cancer?\`
Your response: \`smoking,tobacco use,nicotine exposure,cause,induce,trigger,lead
to,lung cancer,lung malignancy,lung neoplasm\`
`;

const prompt = ChatPromptTemplate.fromMessages<Input>([
	["system", systemPrompt],
	["human", "User question: {question}"],
]);

const model = buildOpenAIChatModel("gpt-3.5-turbo-0125", "ask");

export const generateKeywordsChain = (modelOverride: BaseChatModel = model) =>
	RunnableSequence.from<Input, Output>([
		prompt,
		modelOverride,
		new StringOutputParser(),
		toArray,
	]).withConfig({
		runName: "GenerateKeywords",
	});

const toArray = (str: string) => str.replaceAll("\n", "").split(",");
