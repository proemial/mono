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

The source may be from an article, a report, a file, a website, a video, or something else, so it is best not to make assumptions about the source type.

Create a 100-word summary that highlights the key issue discussed, ensuring that any key points alluded to in the title are included. Format your response as follows:
<summary>
summary goes here
</summary>`;
}
