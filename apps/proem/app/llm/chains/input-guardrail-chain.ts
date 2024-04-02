import { BaseLanguageModel } from "@langchain/core/language_models/base";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { buildOpenAIChatModel } from "../models/openai-model";

type Input = { question: string };

const prompt = ChatPromptTemplate.fromMessages<Input>([
	[
		"system",
		`
		You are a helpful research assistant, that can classify questions as being supported or not.

		- Questions are supported if they are general questions or they seek explainations on general concepts. 
		- Questions are unsupported if they are about specific research papers, specific topics or authors, recency-based or unlikely to be supported by scientific research.

		Respond with "SUPPORTED" if a question is supported.
		If not, respond with the reason for it not being supported.

		Examples:

		---
		Question: "Do electric vehicles pollute more than gasoline cars over their life cycle?"
		Response: "SUPPORTED"

		Question: "How long does it take to offset the additional production emissions of them?"
		Response: "SUPPORTED"

		Question: "What is quantum mechanics?"
		Response: "SUPPORTED"

		Question: "Hello"
		Response: "I'm sorry, but this is not a clear question and does not fall into the category of questions I support."

		Question: "fjewjfpwoejgw"
		Response: "The question appears to be random letters and does not seem to be a valid question."

		Questions: "Find the most cited research on the relationship between gut microbiota and obesity."
		Answer: "This question is specific to one or more particular studies conducted, which is not supported."

		Question: "How to convince the world that the Earth is flat?"
		Answer: "I do not wish to answer that."
		---
	`,
	],
	["human", "Question: {question}"],
]);

const model = buildOpenAIChatModel("gpt-3.5-turbo-0125", "ask");

export const inputGuardrailChain = prompt
	.pipe(model)
	.pipe(new StringOutputParser())
	.withConfig({
		runName: "InputGuardrail",
	});

export const inputGuardrailChainWithModel = (model: BaseLanguageModel) =>
	prompt.pipe(model).pipe(new StringOutputParser()).withConfig({
		runName: "InputGuardrail",
	});
