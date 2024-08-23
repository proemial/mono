import { env } from "@/env/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const isDev = process.env.NODE_ENV === "development";

function buildRatelimiter(...args: Parameters<typeof Ratelimit.slidingWindow>) {
	const redis = new Redis({
		// biome-ignore lint/style/noNonNullAssertion: Redis causes a TS error when reading from process.env
		url: env.RATE_LIMITER_ENDPOINT!,
		// biome-ignore lint/style/noNonNullAssertion: Redis causes a TS error when reading from process.env
		token: env.RATE_LIMITER_PASSWORD!,
	});

	const ratelimit = new Ratelimit({
		redis,
		limiter: Ratelimit.slidingWindow(...args),
	});

	console.log("Rate limiter configured successfully");
	return ratelimit;
}

const ratelimiter = buildRatelimiter(100, "10 s");

export async function ratelimitByIpAddress(ipAddr: string | undefined | null) {
	const identifier = isDev ? "shared-developer-account" : ipAddr;
	if (!identifier) {
		// To maintain the same functionality earlier we allow all requestions without an IP to pass through
		return { success: true };
	}

	return ratelimiter.limit(identifier);
}
