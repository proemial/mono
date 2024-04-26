import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { z } from "zod";

export const buildRatelimiter = (
	noOfRequests: number,
	windowDuration: Parameters<typeof Ratelimit.slidingWindow>["1"],
) => {
	const config = getEnvConfig();
	if (config) {
		const redis = new Redis({ url: config.endpoint, token: config.password });
		const ratelimit = new Ratelimit({
			redis,
			limiter: Ratelimit.slidingWindow(noOfRequests, windowDuration),
		});
		console.log("Rate limiter configured successfully");
		return ratelimit;
	}
};

const getEnvConfig = () => {
	try {
		const endpoint = z.string().parse(process.env.RATE_LIMITER_ENDPOINT);
		const password = z.string().parse(process.env.RATE_LIMITER_PASSWORD);
		return { endpoint, password };
	} catch (error) {
		console.log("Rate limiter not configured for this environment");
	}
};
