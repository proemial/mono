import { authMiddleware } from "@clerk/nextjs";
import { geolocation } from "@vercel/edge";
import { NextResponse } from "next/server";
import { vercelRegions } from "./app/components/analytics/tracking/tracking-keys";
import { buildRatelimiter } from "./ratelimiter";

// geolocation only works on the edge
export const runtime = "experimental-edge";

const ratelimiter = buildRatelimiter(100, "10 s");

export default authMiddleware({
	publicRoutes: ["/(.*)"],
	beforeAuth: async (request, fetchEvent) => {
		if (!request.ip) {
			return NextResponse.next();
		}
		const { success } = await ratelimiter.limit(request.ip);
		if (success) {
			return NextResponse.next();
		}
		console.warn(`Warning: Rate limited request from ${request.ip}`);
		return NextResponse.redirect(new URL("/blocked", request.url));
	},
	afterAuth: (auth, request) => {
		const geo = geolocation(request);
		const requestHeaders = new Headers(request.headers);

		requestHeaders.set(
			"x-region",
			geo?.region ? vercelRegions[geo.region] ?? "eu" : "eu",
		);
		requestHeaders.set("x-country", geo?.country ?? "");

		return NextResponse.next({
			request: {
				headers: requestHeaders,
			},
		});
	},
});

export const config = {
	matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
