import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { ChatHistoryMessage } from "../api/bot/answer-engine/answer-engine";

export type LangChainChatHistoryMessage = HumanMessage | AIMessage;

export const toLangChainChatHistory = (
	message: ChatHistoryMessage,
): LangChainChatHistoryMessage =>
	message.role === "user"
		? new HumanMessage(message.content)
		: new AIMessage(message.content);
