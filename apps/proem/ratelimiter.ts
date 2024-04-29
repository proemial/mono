import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type SidingWindowParams = Parameters<typeof Ratelimit.slidingWindow>;
type NoOfRequests = SidingWindowParams[0];
type WindowDuration = SidingWindowParams[1];

export function buildRatelimiter(
	noOfRequests: NoOfRequests,
	windowDuration: WindowDuration,
) {
	const redis = new Redis({
		url: process.env.RATE_LIMITER_ENDPOINT,
		token: process.env.RATE_LIMITER_PASSWORD,
	});

	const ratelimit = new Ratelimit({
		redis,
		limiter: Ratelimit.slidingWindow(noOfRequests, windowDuration),
	});

	console.log("Rate limiter configured successfully");
	return ratelimit;
}
