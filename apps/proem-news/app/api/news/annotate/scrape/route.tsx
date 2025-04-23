import { Redis } from "@proemial/adapters/redis";
import {
	NewsAnnotatorInitInputStep,
	NewsAnnotatorScrapeInputStep,
} from "@proemial/adapters/redis/news";
import { Time } from "@proemial/utils/time";
import { NextRequest, NextResponse } from "next/server";
import { parseVideo } from "./steps/youtube";
import { parseArticle } from "./steps/article";
import { getColors } from "./steps/color";
import { updateRedis } from "./steps/redis";

export const maxDuration = 300; // seconds

export async function POST(req: NextRequest) {
	const { url } = (await req.json()) as { url: string };

	const begin = Time.now();
	try {
		const item = await Redis.news.get(url);
		if (item?.scrape) {
			return NextResponse.json(item);
		}

		const scraped = await scrape(url);
		const colors = await getColors(scraped.artworkUrl);
		const result = await updateRedis(url, scraped, colors);

		return NextResponse.json(result);
	} finally {
		Time.log(begin, `[annotator][scrape] ${url}`);
	}
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
