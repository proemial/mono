import { authMiddleware } from "@clerk/nextjs";
import { geolocation } from "@vercel/edge";
import { NextResponse } from "next/server";
import { vercelRegions } from "./app/components/analytics/analytics-keys";

// geolocation only works on the edge
export const runtime = "experimental-edge";

export default authMiddleware({
	publicRoutes: ["/(.*)"],
	afterAuth: (auth, request) => {
		const geo = geolocation(request);
		const requestHeaders = new Headers(request.headers);

		// @ts-ignore
		requestHeaders.set("x-region", vercelRegions[geo?.region] ?? "eu");
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
