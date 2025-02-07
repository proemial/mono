import {
	DiffbotImage,
	DiffbotListObject,
	DiffbotResponseType,
	DiffbotTypes,
} from "./diffbot.types";

type ScrapeResponse = {
	type: DiffbotTypes;
	title: string;
	text: string;
	images: DiffbotImage[];
};

export const diffbot = async (url: string): Promise<ScrapeResponse> => {
	const result = await fetch(
		`https://api.diffbot.com/v3/analyze?url=${encodeURIComponent(url)}&token=${process.env.DIFFBOT_API_TOKEN}`,
		{
			method: "GET",
			headers: { accept: "application/json" },
		},
	);

	const data = (await result.json()) as DiffbotResponseType;

	if (!data?.objects?.length) {
		throw new Error("Scraping failed", { cause: `No objects: ${url}` });
	}

	return parseDiffbotResponse(data);
};

function parseDiffbotResponse(scraped: DiffbotResponseType): ScrapeResponse {
	const obj = scraped.objects[0];
	if (!obj) {
		throw new Error("No objects found in response");
	}

	const output = {
		type: scraped.type,
		title: scraped.title,
		// @ts-ignore
		text: obj.text,
		// @ts-ignore
		images: obj.images ?? [],
	};

	if (scraped.type === "list") {
		output.text = (obj as DiffbotListObject).items
			.filter((item) => !!item.summary)
			.map((item) => item.summary)
			.join(". ");
	}

	return output;
}
