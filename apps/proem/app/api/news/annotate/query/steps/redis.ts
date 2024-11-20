import { Redis } from "@proemial/adapters/redis";
import { NewsAnnotatorQueryInputStep } from "@proemial/adapters/redis/news";

export async function getFromRedis(url: string) {
	try {
		return await Redis.news.get(url);
	} catch (e) {
		console.error("[news][query] failed to get from redis", e);
		throw new Error("[news][query] failed to get from redis", {
			cause: {
				url,
				error: e,
			},
		});
	}
}

export async function updateRedis(url: string, query: string) {
	try {
		const result = await Redis.news.update(url, {
			name: "query",
			value: query,
		} as NewsAnnotatorQueryInputStep);

		return result;
	} catch (e) {
		console.error("[news][query] failed to update redis", e);
		throw new Error("[news][query] failed to update redis", {
			cause: {
				url,
				error: e,
			},
		});
	}
}
