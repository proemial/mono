import { CoreAssistantMessage, CoreToolMessage } from "ai";
import { uuid4 } from "../../utils/uuid";

export namespace LlmUtils {
	/**
	 * Transforms a given string into the structure of a tool call incl. it's
	 * associated tool result.
	 *
	 * Useful for adding content to the chat history. Model providers will accept
	 * it as legitimate data from a tool.
	 */
	export const toToolCallMessagePair = (args: {
		content: string;
		toolName: string;
	}) => {
		const toolCallId = uuid4();
		return [
			{
				role: "assistant",
				content: [
					{
						type: "tool-call",
						toolCallId,
						toolName: args.toolName,
						// Args are required by some model providers (e.g. OpenAI), but not
						// used in this synthetic case, of course.
						args: { arg: "dummy" },
					},
				],
			} satisfies CoreAssistantMessage,
			{
				role: "tool",
				content: [
					{
						type: "tool-result",
						toolCallId,
						toolName: args.toolName,
						result: args.content,
					},
				],
			} satisfies CoreToolMessage,
		];
	};
}
