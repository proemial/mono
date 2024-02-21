import { Env } from "@proemial/utils/env";
import { Redis } from "@upstash/redis";

export const UpStash = {
	papers: new Redis({
		url: Env.get("REDIS_PAPERS_URL"),
		token: Env.get("REDIS_PAPERS_TOKEN"),
	}),
};
