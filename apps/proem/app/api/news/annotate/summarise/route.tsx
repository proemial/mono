import { Time } from "@proemial/utils/time";
import { NextRequest, NextResponse } from "next/server";
import { getFromRedis, updateRedis } from "./steps/redis";
import { summarise } from "./steps/summarise";
import { ReferencedPaper } from "@proemial/adapters/redis/news";
import { llmTrace } from "@/components/analytics/braintrust/llm-trace";

export const maxDuration = 300; // seconds

llmTrace.init("proem-news");

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

		const summary = await llmTrace.trace(
			(span) => {
				return summarise(
					url,
					item.query?.value as string,
					item.scrape?.transcript as string,
					item.scrape?.title as string,
					item.papers?.value as ReferencedPaper[],
					span,
				);
			},
			{ name: "News Summary" },
		);

		const result = await updateRedis(url, summary);

		return NextResponse.json(result);
	} finally {
		Time.log(begin, `[annotator][summarise] ${url}`);
	}
}
