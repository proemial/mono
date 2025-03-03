import { SlackDb } from "../../mongodb/slack/slack.adapter";
import { LlamaParseClient } from "../../llamaindex/llama-parse-client";

export const isSlackFileUrl = (url: string) => {
	const urlObj = new URL(url);
	return (
		urlObj.hostname.includes("slack.com") && urlObj.pathname.includes("files")
	);
};

export const slackFileScraper = async (
	fileUrl: string,
	mimetype: string,
	teamId: string,
	appId: string,
	llamaParseClient: LlamaParseClient,
) => {
	console.log(`Slack File Scraper: Scraping file ${fileUrl}…`);
	const install = await SlackDb.installs.get(teamId, appId);
	if (!install) {
		throw new Error("Bot install not found");
	}
	if (!mimetype) {
		throw new Error("File mimetype missing");
	}
	const file = await fetchSlackFile(
		fileUrl,
		install.metadata.accessToken,
		mimetype,
	);
	const { markdown } = await llamaParseClient.parseFile(file);
	return {
		title: file.name,
		text: markdown,
		images: [],
	};
};

const fetchSlackFile = async (url: string, token: string, mimetype: string) => {
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
