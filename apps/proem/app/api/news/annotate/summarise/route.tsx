import { Time } from "@proemial/utils/time";
import { NextRequest, NextResponse } from "next/server";
import { getFromRedis, updateRedis } from "./steps/redis";
import { summarise } from "./steps/summarise";

export const maxDuration = 300; // seconds

export async function POST(req: NextRequest) {
	const { url } = (await req.json()) as { url: string };

	const begin = Time.now();
	try {
		const item = await getFromRedis(url);
		if (
			item?.summarise ||
			!item?.papers ||
			!item.scrape?.transcript ||
			!item.query?.value
		) {
			return NextResponse.json(item);
		}

		const summary = await summarise(
			url,
			item.query.value,
			item.scrape.transcript,
			item.scrape?.title as string,
			item.papers.value,
		);

		const result = await updateRedis(url, summary);

		return NextResponse.json(result);
	} finally {
		Time.log(begin, `[annotator][summarise] ${url}`);
	}
}
