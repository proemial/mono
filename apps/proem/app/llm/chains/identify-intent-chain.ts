import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { buildOpenAIChatModel } from "../models/openai-model";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";

const prompt = ChatPromptTemplate.fromMessages<Input>([
	[
		"system",
		`
		Given a user's question, select one of the following use-cases that best
		matches the user's intent:

		1. Get an answer to an everyday question (backed by scientific research).
		2. Ask a follow-up question to a previously supplied answer.
		3. Get an explanation of a key concept.
		4. Find a specific research article in a database.
		5. Find the latest research articles within a broad domain.
		6. Find the most influential research articles on a specific topic.
		7. Find all research articles by a specific author.
		8. Find all research articles that cite a specific other research article.
		0. Unsure or none of the above.

		Rules:
		- Respond only with the digit of matching item in the list above.
		- If you are unsure which intent best matches the user's intent, respond
			with "0".
	`,
	],
	["human", "User question: {question}"],
]);

const model = buildOpenAIChatModel("gpt-3.5-turbo-0125", "ask", {
	cache: false,
	verbose: true,
});

const stringOutputParser = new StringOutputParser();

type Input = { question: string };
type Output = string;

export const getIdentifyIntentChain = (modelOverride: BaseChatModel = model) =>
	RunnableSequence.from<Input, Output>([
		prompt,
		model,
		stringOutputParser,
	]).withConfig({
		runName: "IdentifyIntent",
	});
