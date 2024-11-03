import { Redis } from "@proemial/adapters/redis";
import {
	NewsAnnotatorInitInputStep,
	NewsAnnotatorScrapeInputStep,
	NewsAnnotatorScrapeStep,
} from "@proemial/adapters/redis/news";
import { Time } from "@proemial/utils/time";
import { NextRequest, NextResponse } from "next/server";
import { parseVideo } from "./youtube";
import { parseArticle } from "./article";

export const maxDuration = 300; // seconds

export async function POST(req: NextRequest) {
	const { url } = (await req.json()) as { url: string };

	const begin = Time.now();
	try {
		const item = await Redis.news.get(url);
		if (item?.scrape) {
			return NextResponse.json(item);
		}

		const { transcript, artworkUrl, title, date } = await scrape(url);

		const { background, foreground } = await getBackground(artworkUrl);
		const { hostname } = new URL(url);
		await Redis.news.set(url, {
			url,
			name: "init",
			host: hostname.replace(/^[^.]+\./, ""), // remove subdomain
			logo: `https://${hostname}.com/favicon.ico`,
			background,
			foreground,
		} as NewsAnnotatorInitInputStep);

		const result = await Redis.news.update(url, {
			name: "scrape",
			transcript,
			artworkUrl,
			title,
			date,
		} as NewsAnnotatorScrapeInputStep);

		return NextResponse.json(result);
	} finally {
		Time.log(begin, `[annotator][scrape] ${url}`);
	}
}

type ColorResponse = {
	responses: {
		imagePropertiesAnnotation: {
			dominantColors: {
				colors: { color: { red: number; green: number; blue: number } }[];
			};
		};
	}[];
};

async function getBackground(
	artworkUrl?: string,
): Promise<{ background?: string; foreground?: string }> {
	if (artworkUrl) {
		try {
			const colorResult = await fetch(
				"https://vision.googleapis.com/v1/images:annotate?key=AIzaSyCAUoYE05Mz6i52ooojtoD5oZk7P3YCK8w",
				{
					method: "POST",
					body: JSON.stringify({
						requests: [
							{
								features: [
									{
										maxResults: 10,
										type: "IMAGE_PROPERTIES",
									},
								],
								image: {
									source: {
										imageUri: artworkUrl,
									},
								},
							},
						],
					}),
				},
			);
			const json = (await colorResult.json()) as ColorResponse;
			const color = json.responses
				.at(0)
				?.imagePropertiesAnnotation.dominantColors.colors.at(0)?.color;
			if (color) {
				const background = `#${color.red.toString(16).padStart(2, "0")}${color.green.toString(16).padStart(2, "0")}${color.blue.toString(16).padStart(2, "0")}`;
				const foreground =
					color.red * 0.299 + color.green * 0.587 + color.blue * 0.114 > 186
						? "#000000"
						: "#FFFFFF";
				return { background, foreground };
			}
		} catch (e) {
			console.error(e);
		}
	}
	return { background: undefined, foreground: undefined };
}

async function scrape(url: string) {
	const itemType =
		url.includes("youtube.com") || url.includes("youtu.be")
			? "youtube"
			: "article";

	const output =
		itemType === "youtube" ? await parseVideo(url) : await parseArticle(url);

	const transcript = output.transcript?.replaceAll("\n", " ");
	console.log(
		"[scrape]",
		`[${transcript?.length ?? 0}]: ${transcript?.slice(0, 50)} ...`,
		!!output.artworkUrl,
	);

	return output;
}
