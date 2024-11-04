import { Redis } from "@proemial/adapters/redis";
import { NewsAnnotatorPapersInputStep } from "@proemial/adapters/redis/news";
import { QdrantPaper } from "./fetch";

export async function getFromRedis(url: string) {
	try {
		return await Redis.news.get(url);
	} catch (e) {
		console.error("[news][query] failed to get from redis", e);
		throw new Error("[news][fetch] failed to get from redis", {
			cause: {
				url,
				error: e,
			},
		});
	}
}

export async function updateRedis(url: string, papers: QdrantPaper[]) {
	try {
		const result = await Redis.news.update(url, {
			name: "papers",
			value: papers,
		} as NewsAnnotatorPapersInputStep);

		return result;
	} catch (e) {
		console.error("[news][fetch] failed to update redis", e);
		throw new Error("[news][fetch] failed to update redis", {
			cause: {
				url,
				error: e,
			},
		});
	}
}
