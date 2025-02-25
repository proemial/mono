import { ScrapflyClient, ScrapeConfig } from "scrapfly-sdk";
import { getLinkPreview } from "link-preview-js";

type ScrapeResult = {
	title: string;
	text: string;
	images: { url: string }[];
};

const client = new ScrapflyClient({
	key: process.env.SCRAPFLY_API_KEY as string,
});

export const scrape = async (url: string): Promise<ScrapeResult> => {
	console.log(`Scraping ${url} with Scrapfly…`);

	let siteTitle: string | undefined = undefined;
	let imageUrl: string | undefined = undefined;
	try {
		const preview = await getLinkPreview(url, {
			followRedirects: "follow",
			imagesPropertyType: "og",
			headers: {
				"user-agent":
					"Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1",
				"Accept-Language": "en-US",
			},
			timeout: 1000,
		});

		if (preview.contentType === "text/html") {
			const { title, images } = preview as { title: string; images: string[] };
			siteTitle = title;
			imageUrl = images[0];
		}
	} catch (error) {
		console.error(`Error getting title and thumbnail: ${error}`);
	}

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
		title: siteTitle ?? "",
		text: apiResponse.result.content,
		images: imageUrl ? [{ url: imageUrl }] : [],
	};
};
