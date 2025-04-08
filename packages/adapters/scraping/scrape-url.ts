import { SlackDb } from "../mongodb/slack/slack.adapter";
import { scrapflyScraper } from "../scrapfly/scraper";
import { errorMessage } from "../slack/error-messages";
import { isSlackFileUrl, slackFileScraper } from "../slack/files/file-scraper";
import { oxylabsYouTubeScraper } from "../youtube/oxylabs";
import { isYouTubeUrl } from "../youtube/shared";

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
				throw new Error(errorMessage.missingFileMimetype());
			}
			const install = await SlackDb.installs.get(
				fileOptions.teamId,
				fileOptions.appId,
			);
			if (!install) {
				throw new Error("Install not found");
			}
			content = await slackFileScraper({
				file: {
					url,
					mimeType: fileOptions.mimeType,
				},
				slackAccessToken: install.metadata.accessToken,
			});
		} else if (isYouTubeUrl(url)) {
			content = await oxylabsYouTubeScraper(url);
		} else {
			content = await scrapflyScraper(url);
		}

		if (isEmptyContent(content)) throw new Error(errorMessage.scrapeEmpty());
	} catch (error) {
		if (isFallbackable(url)) {
			console.warn(`Scraping failed: ${error}\nRetrying…`);
			content = await scrapflyScraper(url);
			if (isEmptyContent(content)) throw new Error(errorMessage.scrapeEmpty());
		} else {
			throw error;
		}
	}

	return content;
}

const isFallbackable = (url: string) => {
	return isYouTubeUrl(url);
};

const isEmptyContent = (content: { text: string | undefined }) =>
	!content.text || content.text.trim().length === 0;
