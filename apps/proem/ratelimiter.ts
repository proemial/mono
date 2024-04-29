import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export function buildRatelimiter(
	...args: Parameters<typeof Ratelimit.slidingWindow>
) {
	const redis = new Redis({
		url: process.env.RATE_LIMITER_ENDPOINT,
		token: process.env.RATE_LIMITER_PASSWORD,
	});

	const ratelimit = new Ratelimit({
		redis,
		limiter: Ratelimit.slidingWindow(...args),
	});

	console.log("Rate limiter configured successfully");
	return ratelimit;
}
