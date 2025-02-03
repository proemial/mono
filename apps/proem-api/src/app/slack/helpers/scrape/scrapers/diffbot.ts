export const diffbot = async (url: string): Promise<ScrapedPage> => {
	const result = await fetch(
		`https://api.diffbot.com/v3/analyze?url=${encodeURIComponent(url)}&token=${process.env.DIFFBOT_API_TOKEN}`,
		{
			method: "GET",
			headers: { accept: "application/json" },
		},
	);

	const data = await result.json();

	if (!data?.objects?.length) {
		throw new Error("Scraping failed", { cause: url });
	}

	const { title, text, images } = data.objects.at(0) as ScrapedPage;

	if (!text?.trim().length) {
		throw new Error("Failed to parse scraped text", { cause: url });
	}

	return {
		title,
		text,
		images: images ?? [],
	};
};

type ScrapedPage = {
	title: string;
	text: string;
	images: {
		url: string;
	}[];
};
