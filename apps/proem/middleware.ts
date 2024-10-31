import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// geolocation only works on the edge
export const runtime = "experimental-edge";

export default clerkMiddleware((auth, req) => {
	const requestHeaders = new Headers(req.headers);
	const pathname = req.nextUrl.pathname;
	requestHeaders.set("x-pathname", pathname ?? "");

	const subdomain = req.nextUrl.hostname.split(".")[0];
	if (subdomain === "app") {
		return NextResponse.redirect(new URL("/news", req.url));
	}
	if (subdomain === "appshare") {
		const searchParams = req.nextUrl.searchParams;
		const url = searchParams.get("url");
		if (url) {
			return NextResponse.redirect(new URL(`/news/${url}`, req.url));
		}
		const text = searchParams.get("text");
		if (text) {
			return NextResponse.redirect(
				new URL(`/unsupported/news/text/${text}`, req.url),
			);
		}
	}

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
