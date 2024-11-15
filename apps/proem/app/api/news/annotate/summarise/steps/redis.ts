import { Redis } from "@proemial/adapters/redis";
import {
	NewsAnnotatorSummariseStep,
	NewsAnnotatorSummariseInputStep,
} from "@proemial/adapters/redis/news";

export async function getFromRedis(url: string) {
	try {
		return await Redis.news.get(url);
	} catch (e) {
		console.error("[news][summarise] failed to get from redis", e);
		throw new Error("[news][summarise] failed to get from redis", {
			cause: {
				url,
				error: e,
			},
		});
	}
}

export async function updateRedis(
	url: string,
	{ commentary, questions, engTitle }: NewsAnnotatorSummariseStep,
) {
	try {
		const result = await Redis.news.update(url, {
			name: "summarise",
			commentary,
			questions,
			engTitle,
		} as NewsAnnotatorSummariseInputStep);

		return result;
	} catch (e) {
		console.error("[news][summarise] failed to update redis", e);
		throw new Error("[news][summarise] failed to update redis", {
			cause: {
				url,
				error: e,
			},
		});
	}
}
