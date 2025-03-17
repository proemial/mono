import { MistralClient } from "../../mistral/mistral-client";
import { LlamaParseClient } from "../../llamaindex/llama-parse-client";

const llamaParseClient = new LlamaParseClient({
	apiKey: process.env.LLAMA_CLOUD_API_KEY as string,
	verbose: true,
});

const mistralClient = new MistralClient({
	apiKey: process.env.MISTRAL_API_KEY,
});

export const slackFileScraper = async ({
	file: { url, mimeType },
	slackAccessToken,
}: {
	file: {
		url: string;
		mimeType: string;
	};
	slackAccessToken: string;
}) => {
	const slackFile = await fetchSlackFile(url, mimeType, slackAccessToken);

	// Scrape PDF files with Mistral OCR
	if (mimeType === "application/pdf") {
		const ocrResponse = await mistralClient.parseWithOCR(slackFile);
		const markdown = ocrResponse.pages
			.map((page) => page.markdown)
			.join("\n\n");
		return {
			title: slackFile.name,
			text: markdown,
			images: [],
		};
	}

	// Scrape other files with LlamaParse
	const { markdown } = await llamaParseClient.parseFile(slackFile);
	return {
		title: slackFile.name,
		text: markdown,
		images: [],
	};
};

const fetchSlackFile = async (url: string, mimetype: string, token: string) => {
	const filename = url.split("/").pop();
	if (!filename) {
		throw new Error("File name missing");
	}
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	const file = await response.blob();
	return new File([file], filename, { type: mimetype });
};

export const isSlackFileUrl = (url: string) => {
	const urlObj = new URL(url);
	return (
		urlObj.hostname.includes("slack.com") && urlObj.pathname.includes("files")
	);
};
