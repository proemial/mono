import { Message } from "ai";
import LlmModels, { AppConfig } from "@proemial/adapters/llm/models";

export const LlmSummary = {
	prompt: summaryPrompt,
	model: async (id: string, appConfig?: AppConfig) =>
		await LlmModels.news.query(id, appConfig),
};

function summaryPrompt() {
	return `Given the following content:

<source_title>$title</source_title>
<source_body>$content</source_body>

Analyze the content and provide a structured response containing a summary, six follow-up questions, and a translated title in the following JSON format:

{
	"summary": "A concise 50 word summary in layman's english that focuses on the key issues described, including whatever might be alluded to in the title. The very first noun used in the summary should relate closely to the key issue.",
	"questions": [
		{
			"question": "Follow-up question that let readers of the commentary dive deeper into the topic, and which can be answered using facts and findings from the research papers. Use layman's language intended for a high school audience, and ensure that the questions reflect a broad range of angles into the topic, with both critical and more celebratory question. Use a maximum of 10 words for each question.",
			"answer": "A short and concise answer in two or three sentences, based on the facts and findings from the research papers. Use layman's terminology and include numerical references to the research papers using brackets (e.g. [1], [2], etc)."
		}
	],
	"translatedTitle": "US English version of title (max 10 words, include country if non-US)"
}`;
}
