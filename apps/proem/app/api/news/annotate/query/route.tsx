import { Time } from "@proemial/utils/time";
import { NextRequest, NextResponse } from "next/server";
import { generateQuery } from "./steps/query";
import { getFromRedis, updateRedis } from "./steps/redis";

export const maxDuration = 300; // seconds

export async function POST(req: NextRequest) {
	const { url } = (await req.json()) as { url: string };

	const begin = Time.now();
	try {
		const item = await getFromRedis(url);
		if (item?.query || !item?.scrape) {
			return NextResponse.json(item);
		}

		const indexQuery = await generateQuery(
			url,
			item.scrape?.transcript as string,
		);
		const result = await updateRedis(url, indexQuery);

		return NextResponse.json(result);
	} finally {
		Time.log(begin, `[annotator][query] ${url}`);
	}
}
