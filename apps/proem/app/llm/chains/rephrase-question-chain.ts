import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
	ChatPromptTemplate,
	MessagesPlaceholder,
} from "@langchain/core/prompts";
import { buildOpenAIChatModel } from "../models/openai-model";
import { LangChainChatHistoryMessage } from "../utils";

type Input = {
	question: string;
	chatHistory: LangChainChatHistoryMessage[];
};

const prompt = ChatPromptTemplate.fromMessages<Input>([
	[
		"system",
		`
You are tasked with rephrasing a user's question, so that it becomes unambiguous
and makes sense standing on its own. Use the chat history to understand the
context of the question. Your rephrased question should be clear and concise. If
you find it necessary, you may expand the question so it includes enough
information to make it unambiguous.

If a user is not asking a question, do not rephase the it, but instead reply
with the given input.

If a user asks to change the subject, ignore the chat history.
`,
	],
	new MessagesPlaceholder("chatHistory"),
	["human", "Question: {question}"],
]);

const model = buildOpenAIChatModel("gpt-4o", "ask");

export const rephraseQuestionChain = (modelOverride: BaseChatModel = model) =>
	prompt.pipe(modelOverride).pipe(new StringOutputParser());
