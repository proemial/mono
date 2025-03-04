import { ScrapflyClient, ScrapeConfig } from "scrapfly-sdk";
import { fetchOgDetails } from "../scraping/og";

type ScrapeResult = {
	title: string;
	text: string;
	images: { url: string }[];
};

const client = new ScrapflyClient({
	key: process.env.SCRAPFLY_API_KEY as string,
});

export const scrapflyScraper = async (url: string): Promise<ScrapeResult> => {
	console.log(`Scrapfly Scraper: Scraping ${url}…`);

	const { title, imageUrl } = await fetchOgDetails(url);

	const apiResponse = await client.scrape(
		new ScrapeConfig({
			tags: ["project:default"],
			format: "text",
			format_options: ["only_content"],
			cache: true,
			country: "dk",
			lang: ["en"],
			asp: true,
			render_js: true,
			auto_scroll: true,
			url: url,
		}),
	);

	if (!apiResponse.result.success) {
		throw new Error(
			`Failed to scrape with Scrapfly: ${apiResponse.result.error?.message}`,
			{
				cause: {
					url,
					error: apiResponse.result.error,
				},
			},
		);
	}

	return {
		title: title ?? "",
		text: apiResponse.result.content,
		images: imageUrl ? [{ url: imageUrl }] : [],
	};
};
