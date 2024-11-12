import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isBlockedUrl } from "./app/(experiments)/news/blocked";

// geolocation only works on the edge
export const runtime = "experimental-edge";

const baseUrl = "https://app.proem.ai";

export default clerkMiddleware((auth, req) => {
	const requestHeaders = new Headers(req.headers);
	const pathname = req.nextUrl.pathname;
	requestHeaders.set("x-pathname", pathname ?? "");

	const searchParams = req.nextUrl.searchParams;
	const subdomain = req.nextUrl.hostname.split(".")[0];

	if (subdomain === "apphome") {
		return NextResponse.redirect(
			new URL(`${baseUrl}/news?${searchParams}`, req.url),
		);
	}
	if (subdomain === "appshare") {
		const searchParams = req.nextUrl.searchParams;
		const url = searchParams.get("url") ?? "";
		const params = searchParams.toString();

		const isBlockedError = isBlockedUrl(url);
		if (isBlockedError) {
			return NextResponse.redirect(
				new URL(
					`${baseUrl}/news?error=${encodeURIComponent(isBlockedError)}&${params}`,
					req.url,
				),
			);
		}
		if (url) {
			return NextResponse.redirect(
				new URL(
					`${baseUrl}/news/${encodeURIComponent(url)}?${params}`,
					req.url,
				),
			);
		}
		const text = searchParams.get("text");
		if (text) {
			return NextResponse.redirect(
				new URL(
					`${baseUrl}/unsupported/news/text/${encodeURIComponent(text)}?${params}`,
					req.url,
				),
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
