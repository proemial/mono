import { Time } from "@proemial/utils/time";
import { Redis } from "@upstash/redis";

const redis = () =>
	new Redis({
		url: process.env.UPSTASH_REDIS_REST_URL,
		token: process.env.UPSTASH_REDIS_REST_TOKEN,
	});

export const RedisPaperState = {
	get: async (identifier: string): Promise<RedisPaperState> => {
		const begin = Time.now();

		try {
			const state = (await redis().get(`${identifier}`)) as RedisPaperState;

			return state ?? { completed: [] };
		} catch (error) {
			console.error(error);
			throw error;
		} finally {
			Time.debug(begin, `[redis][summaries][get] ${identifier}`);
		}
	},

	update: async (
		identifier: string,
		state: RedisPaperState,
	): Promise<RedisPaperState> => {
		await redis().set(identifier, state);
		console.log("[redis][state] updated: ", state);

		return state;
	},

	isDone: (state: RedisPaperState): boolean => {
		return (
			state.completed.includes("fetch") &&
			state.completed.includes("title") &&
			state.completed.includes("description")
		);
	},
};

export type RedisPaperState = {
	completed: Array<"fetch" | "title" | "description">;
};
