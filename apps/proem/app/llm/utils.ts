import { AIMessage, HumanMessage } from "@langchain/core/messages";

export type LangChainChatHistoryMessage = HumanMessage | AIMessage;

export const toLangChainChatHistory = <
	T extends { role: string; content: string },
>(
	message: T,
): LangChainChatHistoryMessage =>
	message.role === "user"
		? new HumanMessage(message.content)
		: new AIMessage(message.content);
