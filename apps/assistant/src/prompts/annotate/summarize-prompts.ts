import { generateText } from "ai";
import LlmModels from "@proemial/adapters/llm/models";

export const generateSummary = async (
	content: string,
	title: string,
	traceId?: string,
): Promise<string> => {
	try {
		const { text, usage } = await generateText({
			model: await LlmModels.assistant.query(traceId),
			messages: [
				{
					role: "user",
					content: `
Given the following content:

<source_title>${title}</source_title>
<source_body>${content}</source_body>

Create a 100-word summary that highlights the key issue discussed, ensuring that any key points alluded to in the title are included. Format your response as follows:
<summary>
summary goes here
</summary>
			`,
				},
			],
		});
		console.log("[generateIndexSearchQuery]", usage);
		console.log("[generateIndexSearchQuery]", text);
		return text;
	} catch (e) {
		console.error("[news][query] generateIndexSearchQuery failed", e);
		throw new Error("[news][query] generateIndexSearchQuery failed", {
			cause: e,
		});
	}
};
