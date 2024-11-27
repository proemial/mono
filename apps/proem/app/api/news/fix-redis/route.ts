import { NextResponse } from "next/server";
import { getFromRedis, updateRedis } from "../annotate/summarise/steps/redis";
import {
	NewsAnnotatorSteps,
	NewsAnnotatorSummariseStep,
} from "@proemial/adapters/redis/news";
import { UpStash } from "@proemial/adapters/redis/upstash-client";

export async function GET() {
	const keys = (
		await UpStash.news().scan(0, {
			count: 1000,
		})
	)[1];

	let updated = 0;
	for (const key of keys) {
		const item = await getFromRedis(key);
		updated += (await migrate(key, item)) || 0;
	}

	return NextResponse.json({ updated });
}

async function migrate(url: string, item?: NewsAnnotatorSteps) {
	if (Array.isArray(item?.summarise?.questions?.at(0))) {
		console.log("Migrating to object array", url);
		const updatedItem = {
			...item.summarise,
			// @ts-ignore
			questions: item.summarise.questions.map((question: string[]) => ({
				question: question[0],
				answer: question[1],
			})),
		} as NewsAnnotatorSummariseStep;

		await updateRedis(url, updatedItem);

		return 1;
	}
	return 0;
}
