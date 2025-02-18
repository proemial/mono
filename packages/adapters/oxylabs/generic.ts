import LlmModels from "../llm/models";
import { generateText } from "ai";

type GenericScraperResponse = {
	title: string;
	text: string;
	images: { url: string; width: number; height: number }[];
};

type ScraperResponse = {
	results: {
		content: string;
	}[];
	message?: string;
};

/**
 * Scrapes a generic site using Oxylabs to get the rendered HTML, and then uses
 * a LLM to extract the main textual content.
 *
 * Note: May exceed LLM context window.
 */
export const scrapeGenericSite = async (
	url: string,
): Promise<GenericScraperResponse> => {
	try {
		const username = process.env.OXYLABS_USERNAME;
		const password = process.env.OXYLABS_PASSWORD;
		if (!username || !password) {
			throw new Error("Missing OxyLabs credentials");
		}
		const body = {
			source: "universal",
			url: url,
			user_agent_type: "desktop_chrome",
			render: "html",
		};
		const response = await fetch("https://realtime.oxylabs.io/v1/queries", {
			method: "POST",
			body: JSON.stringify(body),
			headers: {
				"Content-Type": "application/json",
				Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
			},
		});

		const responsePayload = (await response.json()) as ScraperResponse;
		if (responsePayload.message) {
			throw new Error(`OxyLabs error: ${responsePayload.message}`);
		}
		if (!responsePayload.results?.at(0)?.content) {
			throw new Error("No content found");
		}

		const { text } = await generateText({
			model: await LlmModels.assistant.query(),
			system:
				"You are a helpful assistant that extracts the main textual content from a given string of HTML. Ignore any layout and styling information, and return only the main textual content that is visible and relevant to a user visiting the website.",
			prompt: `Extract the main textual content from the following HTML: ${responsePayload.results[0]?.content}`,
		});

		return {
			title: "", // TODO: Get the title from the HTML
			text: text,
			images: [], // TODO: Maybe use OG info to get images
		};
	} catch (error) {
		console.error("Error scraping generic site:", error);
		throw error;
	}
};
