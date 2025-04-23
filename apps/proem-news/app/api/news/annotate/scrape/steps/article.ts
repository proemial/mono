import { NewsAnnotatorScrapeStep } from "@proemial/adapters/redis/news";
import { scrapflyScraper } from "@proemial/adapters/scrapfly/scraper";

export const parseArticle = async (
	url: string,
): Promise<NewsAnnotatorScrapeStep> => {
	const { title, text, images } = await scrapflyScraper(url);

	const transcript = text?.replaceAll("\n", " ");
	const artworkUrl = images.at(0)?.url;

	if (!transcript?.trim().length) {
		throw new Error("[news][scrape] Failed to parse article", { cause: url });
	}

	return {
		transcript,
		artworkUrl,
		title,
		date: undefined,
	};
};
