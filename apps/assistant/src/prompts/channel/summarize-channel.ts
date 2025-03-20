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

Analyze the channel name, topic, purpose, and the latest 100 messages and provide a structured response containing a summary and six suggested questions, in the following JSON format:
{
	"summary": "Analyze the channel name, topic, purpose, and the latest 100 messages. Based on this information, generate a concise yet informative summary that captures the channel’s primary focus, recurring themes, and the nature of discussions. If applicable, highlight key subjects, common types of interactions (e.g., Q&A, brainstorming, sharing updates), and any implicit objectives that emerge from the conversations. The summary should be 2-3 sentences long and written in a professional but accessible tone.",
	"questions": [
		"Suggested questions that is likely to be supported by science. The questions should reflect a broad range of angles, with both critical and more celebratory question. Use a maximum of 10 words for each question."
	]
}

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
				questions: z.array(z.string()).describe("The six suggested questions."),
			}),
		});

		console.log("[summarizeChannel]", object);

		return object;
	} catch (e) {
		console.error("[channel][summarizeChannel] failed", e);
		throw new Error("[channel][summarizeChannel] failed", {
			cause: { error: e },
		});
	}
};
