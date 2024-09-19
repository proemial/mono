import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// geolocation only works on the edge
export const runtime = "experimental-edge";

export default clerkMiddleware((auth, req) => {
	const requestHeaders = new Headers(req.headers);
	const pathname = req.nextUrl.pathname;
	requestHeaders.set("x-pathname", pathname ?? "");

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
