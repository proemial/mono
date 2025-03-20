import { generateObject } from "ai";
import LlmModels from "@proemial/adapters/llm/models";
import { z } from "zod";

const prompt = (
	channel: { name: string; topic: string; purpose: string },
	messages: string[],
) => `
Given the following details about a Slack channel:
	•	Channel Name: ${channel.name}
	•	Channel Topic: ${channel.topic}
	•	Channel Purpose: ${channel.purpose}
	•	Recent Messages (100 messages):
	${messages.map((message, index) => `•	Message ${index + 1}: ${message}`).join("\n")}

Task:
Analyze the channel name, topic, purpose, and the latest 100 messages. Based on this information, generate a concise yet informative summary that captures the channel’s primary focus, recurring themes, and the nature of discussions. If applicable, highlight key subjects, common types of interactions (e.g., Q&A, brainstorming, sharing updates), and any implicit objectives that emerge from the conversations.

The summary should be 2-3 sentences long and written in a professional but accessible tone.
`;

export const summarizeChannel = async (
	channel: { name: string; topic: string; purpose: string },
	messages: string[],
	traceId?: string,
) => {
	try {
		const { object, usage } = await generateObject({
			model: await LlmModels.assistant.background(traceId),
			prompt: prompt(channel, messages),
			output: "object",
			schema: z.object({
				summary: z.string().describe("The summary of the channel."),
			}),
		});

		console.log("[summarizeChannel]", usage);
		return object;
	} catch (e) {
		console.error("[channel][summarizeChannel] failed", e);
		throw new Error("[channel][summarizeChannel] failed", {
			cause: { error: e },
		});
	}
};
