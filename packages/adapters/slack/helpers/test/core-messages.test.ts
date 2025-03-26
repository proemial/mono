import { describe, expect, it } from "vitest";
import { toCoreMessages } from "../thread";
import { MessageElement } from "@slack/web-api/dist/types/response/ConversationsRepliesResponse";

import inStubWithLinks from "./stub-withlinks-in.json";
import outStubWithLinks from "./stub-withlinks-out.json";
import { urlStubbedLinks } from "./stub-nolink-scraped";

describe("with links", () => {
	it("should handle messages with URLs", () => {
		const result = toCoreMessages(
			inStubWithLinks[0] as MessageElement,
			urlStubbedLinks,
		);

		expect(result).toHaveLength(5);
		expect(result.map(withoutToolCallId)).toEqual(
			outStubWithLinks.slice(0, 5).map(withoutToolCallId),
		);
	});

	it("should ignore debug messages", () => {
		const result = toCoreMessages(inStubWithLinks[2] as MessageElement, []);
		expect(result).toHaveLength(0);
	});

	it("Should present suggestions as user messages ", () => {
		const result = toCoreMessages(inStubWithLinks[1] as MessageElement, []);

		expect(result).toHaveLength(1);
		expect(result).toEqual([outStubWithLinks[5]]);
	});
});

function withoutToolCallId(message: Message) {
	// Create a deep copy to avoid modifying the original
	const result = JSON.parse(JSON.stringify(message)) as Message;

	// Handle tool call messages where toolCallId might be in content items
	if (result.content && Array.isArray(result.content)) {
		result.content = result.content.map((item: MessageContent) => {
			const { toolCallId, ...rest } = item;
			return rest;
		});
	}

	// Also handle potential top-level toolCallId
	if ("toolCallId" in result) {
		const { toolCallId, ...rest } = result;
		return rest;
	}

	return result;
}

interface MessageContent {
	type?: string;
	toolCallId?: string;
	toolName?: string;
	args?: Record<string, string>;
	result?: string;
	[key: string]: unknown;
}

interface Message {
	role?: string;
	content?: string | MessageContent[];
	toolCallId?: string;
	[key: string]: unknown;
}
