import { vercelRegions } from "@/components/analytics/tracking/tracking-keys";
import { clerkMiddleware } from "@clerk/nextjs/server";
import { geolocation } from "@vercel/edge";
import { NextResponse } from "next/server";

// geolocation only works on the edge
export const runtime = "experimental-edge";

export default clerkMiddleware((auth, req) => {
	const geo = geolocation(req);
	const requestHeaders = new Headers(req.headers);

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
	// },
	// ignoredRoutes: ["/((?!api|trpc|paper/arxiv))(_next.*|.+\\.[\\w]+$)"],
});

export const config = {
	// The `paper/arxiv` part is a work-around for Clerk not supporting URLs
	// with `.` in them.
	// GitHub issue: https://github.com/clerk/javascript/issues/1656
	matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc|paper/arxiv)(.*)"],
};
