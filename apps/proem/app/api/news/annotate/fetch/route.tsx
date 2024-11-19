import { Time } from "@proemial/utils/time";
import { NextRequest, NextResponse } from "next/server";
import { getFromRedis, updateRedis } from "./steps/redis";
import { fetchPapers } from "./steps/fetch";
import { llmTrace } from "@/components/analytics/braintrust/llm-trace";

export const maxDuration = 300; // seconds

llmTrace.init(llmTrace.projects.News);

export async function POST(req: NextRequest) {
	const { url } = (await req.json()) as { url: string };

	const begin = Time.now();
	try {
		const item = await getFromRedis(url);
		if (item?.papers || !item?.query) {
			return NextResponse.json(item);
		}

		const papers = await llmTrace.trace(
			() => {
				return fetchPapers(url, item.query?.value as string);
			},
			{ parent: item.query?.traceId },
		);

		if (!papers) {
			throw new Error("No papers found");
		}
		console.log("[papers]", papers.length);

		const result = await updateRedis(url, papers);

		return NextResponse.json(result);
	} finally {
		Time.log(begin, `[annotator][papers] ${url}`);
	}
}
