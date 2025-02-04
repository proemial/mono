export const diffbot = async (url: string) => {
	const result = await fetch(
		`https://api.diffbot.com/v3/analyze?url=${encodeURIComponent(url)}&token=${process.env.DIFFBOT_API_TOKEN}`,
		{
			method: "GET",
			headers: { accept: "application/json" },
		},
	);

	const data = await result.json();

	if (!data?.objects?.length) {
		console.log(data);
		throw new Error("Scraping failed", { cause: url });
	}

	const { title, text, images, mime } = data.objects.at(0);

	if (!text?.trim().length) {
		throw new Error("Failed to parse scraped text", { cause: url });
	}

	return {
		title,
		text,
		images: images ?? [],
		mime,
	};
};
