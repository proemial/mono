import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// geolocation only works on the edge
export const runtime = "experimental-edge";
// Todo: add app.proem.ai
const baseUrl = "https://proem.ai";

export default clerkMiddleware((auth, req) => {
	const requestHeaders = new Headers(req.headers);
	const pathname = req.nextUrl.pathname;
	requestHeaders.set("x-pathname", pathname ?? "");

	const subdomain = req.nextUrl.hostname.split(".")[0];
	// Todo: remove app
	if (subdomain === "apphome" || subdomain === "app") {
		return NextResponse.redirect(new URL(`${baseUrl}/news`, req.url), {
			headers: {
				"x-platform": "app",
			},
		});
	}
	if (subdomain === "appshare") {
		const searchParams = req.nextUrl.searchParams;
		const url = searchParams.get("url");
		if (url) {
			return NextResponse.redirect(
				new URL(`${baseUrl}/news/${encodeURIComponent(url)}`, req.url),
				{
					headers: {
						"x-platform": "app",
					},
				},
			);
		}
		const text = searchParams.get("text");
		if (text) {
			return NextResponse.redirect(
				new URL(
					`${baseUrl}/unsupported/news/text/${encodeURIComponent(text)}`,
					req.url,
				),
				{
					headers: {
						"x-platform": "app",
					},
				},
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
