import { Time } from "@proemial/utils/time";
import { UpStash } from "./upstash-client";

export const RedisSummaries = {
	get: async (identifier: string): Promise<RedisSummaries | null> => {
		const begin = Time.now();

		try {
			return (await UpStash.summaries().get(
				`${identifier}`,
			)) as RedisSummaries | null;
		} catch (error) {
			console.error(error);
			throw error;
		} finally {
			Time.debug(begin, `[redis][summaries][get] ${identifier}`);
		}
	},

	insert: async (identifier: string, summaries: RedisSummaries) => {
		const begin = Time.now();

		try {
			await UpStash.summaries().set(identifier, summaries);
			return summaries;
		} finally {
			Time.debug(begin, `[redis][summaries][insert] ${identifier}`);
		}
	},
};

export type RedisSummaries = {
	[key: string]: { summary: string; hash: string };
};
