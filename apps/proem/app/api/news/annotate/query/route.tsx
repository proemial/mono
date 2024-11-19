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

		const { query, traceId } = await llmTrace.trace(
			async (span) => {
				const query = await generateQuery(
					url,
					item.scrape?.transcript as string,
					item.scrape?.title as string,
				);

				span.log({
					input: item.scrape?.title,
					output: query,
					metadata: {
						url,
					},
					tags: ["annotate"],
				});

				const traceId = await llmTrace.traceId();
				return { query, traceId };
			},
			{ name: "News Scraper" },
		);
		const result = await updateRedis(url, query, traceId);

		return NextResponse.json(result);
	} finally {
		Time.log(begin, `[annotator][query] ${url}`);
	}
}
