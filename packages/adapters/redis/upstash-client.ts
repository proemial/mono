import { Redis } from "@upstash/redis";

export const UpStash = {
	papers: () =>
		new Redis({
			url: process.env.REDIS_PAPERS_URL,
			token: process.env.REDIS_PAPERS_TOKEN,
		}),
};
