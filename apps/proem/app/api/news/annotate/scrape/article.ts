import { NewsAnnotatorScrapeStep } from "@proemial/adapters/redis/news";

export const parseArticle = async (
	url: string,
): Promise<NewsAnnotatorScrapeStep> => {
	const rawTranscript = await fetchUniversalArticleTranscript(url);

	if (!rawTranscript?.objects?.length) {
		console.error("[scrape] failed to fetch article transcript", rawTranscript);
		throw new Error("Scraping failed");
	}

	const { title, text, date, images } = rawTranscript.objects.at(
		0,
	) as ArticleTranscriptObject;

	const transcript = text?.replaceAll("\n", " ");
	const artworkUrl = images[0]?.url;

	return {
		transcript,
		artworkUrl,
		title,
		date,
	};
};

type ArticleTranscriptPayload = {
	objects: ArticleTranscriptObject[];
};

type ArticleTranscriptObject = {
	title: string;
	text: string;
	date: string;
	images: {
		url: string;
	}[];
};

const fetchUniversalArticleTranscript = async (
	url: string,
): Promise<ArticleTranscriptPayload> => {
	console.log(
		"[scrape] fetching article transcript",
		url,
		encodeURIComponent(url),
	);

	const result = await fetch(
		`https://api.diffbot.com/v3/article?url=${encodeURIComponent(url)}&token=${process.env.DIFFBOT_API_TOKEN}`,
		{
			method: "GET",
			headers: { accept: "application/json" },
		},
	);

	return await result.json();
};
