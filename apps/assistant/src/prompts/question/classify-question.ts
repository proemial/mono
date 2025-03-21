import { generateObject } from "ai";
import LlmModels from "@proemial/adapters/llm/models";
import { z } from "zod";

const prompt = (message: string) => `
You are a classifier that decides whether a Slack message is a question the bot should attempt to answer. The bot can answer:
	•	Questions related to science or scientific research
	•	Questions that reference shared resources (e.g., links, attached documents, summaries)
	•	Follow-up questions in a thread that relate to earlier messages

The message is considered relevant if:
	•	It is phrased as a question (explicitly or implicitly)
	•	It appears to be seeking an answer or clarification
	•	It relates to one of the bot’s domains (science, shared resources, or thread context)

Respond only with “Yes” if the message is a question the bot should answer. Otherwise, respond with “No.”

Examples:
	1.	Message: “How does this study define ‘significance’?”
→ Yes
	2.	Message: “Can someone explain Figure 2?”
→ Yes
	3.	Message: “Looks good to me!”
→ No
	4.	Message: “@john what do you think about the chart?”
→ No
	5.	Message: “I’m not sure I understand the methodology here.”
→ Yes
	6.	Message: “Didn’t we already address this in the doc from last week?”
→ Yes

Now classify this message: "${message}"
`;

export const classifyQuestion = async (message: string, traceId?: string) => {
	try {
		const { object, usage } = await generateObject({
			model: await LlmModels.assistant.background(traceId),
			prompt: prompt(message),
			output: "object",
			schema: z.object({
				answer: z
					.boolean()
					.describe("Whether the message is a question the bot should answer."),
			}),
		});

		console.log("[classifyQuestion]", JSON.stringify(object));

		return object;
	} catch (e) {
		console.error("[question][classifyQuestion] failed", e);
		throw new Error("[question][classifyQuestion] failed", {
			cause: { error: e },
		});
	}
};
