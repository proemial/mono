import { Redis } from "@proemial/adapters/redis";
import {
	NewsAnnotatorPapersInputStep,
	ReferencedPaper,
} from "@proemial/adapters/redis/news2";
import { Time } from "@proemial/utils/time";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 600; // seconds

export async function POST(req: NextRequest) {
	const { url } = (await req.json()) as { url: string };

	const begin = Time.now();
	try {
		const item = await Redis.news2.get(url);
		if (item?.papers || !item?.query) {
			return NextResponse.json(item);
		}

		const papersResult = await fetch("https://index.proem.ai/api/search", {
			method: "POST",
			body: JSON.stringify({
				query: item.query?.value as string,
				from: "2024-01-01",
				extended: true,
			}),
		});
		const papers = (await papersResult.json()) as SearchResult;

		if (!papers) {
			throw new Error("No papers found");
		}

		console.log("[papers]", papers.papers.length);

		const result = await Redis.news2.update(url, {
			name: "papers",
			value: papers.papers,
		} as NewsAnnotatorPapersInputStep);

		return NextResponse.json(result);
	} finally {
		Time.log(begin, `[annotator][papers] ${url}`);
	}
}

type SearchResult = {
	papers: QdrantPaper[];
};

export type QdrantPaper = ReferencedPaper & {
	score: number;
	features: Feature[];
};

type Feature = {
	id: string;
	label: string;
	score: number;
	type: "topic" | "keyword" | "concept";
};
