import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest } from "next/server";

const isDev = process.env.NODE_ENV === "development";

function buildRatelimiter(...args: Parameters<typeof Ratelimit.slidingWindow>) {
	const redis = new Redis({
		// biome-ignore lint/style/noNonNullAssertion: Redis causes a TS error when reading from process.env
		url: process.env.RATE_LIMITER_ENDPOINT!,
		// biome-ignore lint/style/noNonNullAssertion: Redis causes a TS error when reading from process.env
		token: process.env.RATE_LIMITER_PASSWORD!,
	});

	const ratelimit = new Ratelimit({
		redis,
		limiter: Ratelimit.slidingWindow(...args),
	});

	console.log("Rate limiter configured successfully");
	return ratelimit;
}

const ratelimiter = buildRatelimiter(100, "10 s");

export async function ratelimitRequest(request: NextRequest) {
	const identifier = isDev ? "shared-developer-account" : request.ip;
	if (!identifier) {
		throw new Error("No identifier found");
	}

	return ratelimiter.limit(identifier);
}
