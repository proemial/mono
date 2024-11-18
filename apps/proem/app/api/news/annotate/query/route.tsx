import { Time } from "@proemial/utils/time";
import { NextRequest, NextResponse } from "next/server";
import { generateQuery } from "./steps/query";
import { getFromRedis, updateRedis } from "./steps/redis";
import { llmTrace } from "@/components/analytics/braintrust/llm-trace";

export const maxDuration = 300; // seconds

llmTrace.init("proem-news");

export async function POST(req: NextRequest) {
	const { url } = (await req.json()) as { url: string };

	const begin = Time.now();
	try {
		const item = await getFromRedis(url);
		if (item?.query || !item?.scrape) {
			return NextResponse.json(item);
		}

		const indexQuery = await llmTrace.trace(
			(span) => {
				return generateQuery(
					url,
					item.scrape?.transcript as string,
					item.scrape?.title as string,
					span,
				);
			},
			{ name: "News Query" },
		);
		const result = await updateRedis(url, indexQuery);

		return NextResponse.json(result);
	} finally {
		Time.log(begin, `[annotator][query] ${url}`);
	}
}
