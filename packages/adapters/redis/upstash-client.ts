import { Redis } from "@upstash/redis";

export const UpStash = {
	papers: () =>
		new Redis({
			url: process.env.REDIS_PAPERS_NEW_URL,
			token: process.env.REDIS_PAPERS_NEW_TOKEN,
		}),
	spaces: () =>
		new Redis({
			url: process.env.REDIS_SPACES_URL,
			token: process.env.REDIS_SPACES_TOKEN,
		}),
	summaries: () =>
		new Redis({
			url: process.env.REDIS_SUMMARIES_URL,
			token: process.env.REDIS_SUMMARIES_TOKEN,
		}),
	newsFeed: () =>
		new Redis({
			url: process.env.REDIS_NEWS_FEED_URL,
			token: process.env.REDIS_NEWS_FEED_TOKEN,
		}),
	news: () =>
		new Redis({
			url: process.env.REDIS_NEWS2_URL,
			token: process.env.REDIS_NEWS2_TOKEN,
		}),
};
