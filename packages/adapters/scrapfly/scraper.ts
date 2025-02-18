import { ScrapflyClient, ScrapeConfig } from "scrapfly-sdk";

type ScrapeResult = {
	title: string;
	text: string;
	images: { url: string; width: number; height: number }[];
};

const client = new ScrapflyClient({
	key: process.env.SCRAPFLY_API_KEY as string,
});

export const scrape = async (url: string): Promise<ScrapeResult> => {
	console.log(`Scraping ${url} with Scrapfly…`);
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

	return {
		title: "",
		text: apiResponse.result.content,
		images: [],
	};
};
