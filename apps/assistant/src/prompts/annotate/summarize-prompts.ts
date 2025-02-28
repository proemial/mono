import { Message } from "ai";
import LlmModels from "@proemial/adapters/llm/models";

export const LlmSummary = {
	prompt: summaryPrompt,
	model: async (id: string) => await LlmModels.news.query(id),
	// messages: (title: string, content: string) => [
	// 	{
	// 		role: "user",
	// 		content: summaryMessage()
	// 			.replace("$title", title)
	// 			.replace("$content", content),
	// 	} as Message,
	// ],
};

function summaryPrompt() {
	return `Given the following content:

<source_title>$title</source_title>
<source_body>$content</source_body>

Create a concise 50 word summary in layman's english that focuses on the key issues described, including whatever might be alluded to in the title. The very first noun used in the summary should relate closely to the key issue. Format your response in the following way:

<summary>
summary goes here
</summary>`;
}
