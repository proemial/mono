import { diffbot } from "@/diffbot";
import { LlamaParseClient } from "@/llamaindex/llama-parse-client";
import { scrape } from "@/scrapfly/scraper";
import { isSlackFileUrl, parseSlackFile } from "@/slack/files";
import { isTwitterUrl } from "@/twitter";
import { fetchTranscript } from "@/youtube/oxylabs";
import { isYouTubeUrl } from "@/youtube/shared";

const llamaParseClient = new LlamaParseClient({
	apiKey: process.env.LLAMA_CLOUD_API_KEY as string,
	verbose: true,
});

export async function scrapeUrl(
	url: string,
	fileOptions: { mimeType: string | undefined; teamId: string; appId: string },
) {
	let content:
		| {
				text: string;
				title: string;
				images?: { url: string }[];
		  }
		| undefined;

	try {
		if (isSlackFileUrl(url)) {
			if (!fileOptions.mimeType) {
				throw new Error("Missing file mimetype");
			}
			content = await parseSlackFile(
				url,
				fileOptions.mimeType,
				fileOptions.teamId,
				fileOptions.appId,
				llamaParseClient,
			);
		} else if (isYouTubeUrl(url)) {
			content = await fetchTranscript(url);
		} else if (isTwitterUrl(url)) {
			content = await scrape(url);
		} else {
			content = await diffbot(url);
		}

		if (isEmptyContent(content)) throw new Error("Scraped content is empty");
	} catch (error) {
		if (isFallbackable(url)) {
			console.warn(`Scraping failed: ${error}\nRetrying…`);
			content = await scrape(url);
			if (isEmptyContent(content)) throw new Error("Scraped content is empty");
		} else {
			throw error;
		}
	}

	return content;
}

const isFallbackable = (url: string) => {
	// Don't retry scraping if it's a file or Twitter url (which is already tried with Scrapfly)
	return !isSlackFileUrl(url) && !isTwitterUrl(url);
};

const isEmptyContent = (content: { text: string | undefined }) =>
	!content.text || content.text.trim().length === 0;
