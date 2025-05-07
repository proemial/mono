import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const baseUrl = "https://app.proem.ai";

export function middleware(req: NextRequest) {
	const searchParams = req.nextUrl.searchParams;
	const subdomain = req.nextUrl.hostname.split(".")[0];
	const url = searchParams.get("url") ?? "";
	const params = new URLSearchParams(searchParams).toString();

	const forwardUrl = `${baseUrl}/${encodeURIComponent(url)}?${params}`;

	if (subdomain === "apphome") {
		console.log("apphome", forwardUrl);
		return NextResponse.redirect(new URL(forwardUrl, req.url));
	}

	if (subdomain === "appshare") {
		const isBlockedError = isBlockedUrl(url);
		if (isBlockedError) {
			console.log(
				"appshare",
				`${baseUrl}?error=${encodeURIComponent(isBlockedError)}&${params}`,
			);
			return NextResponse.redirect(
				new URL(
					`${baseUrl}?error=${encodeURIComponent(isBlockedError)}&${params}`,
					req.url,
				),
			);
		}
		if (url) {
			console.log("appshare", forwardUrl);
			return NextResponse.redirect(new URL(forwardUrl, req.url));
		}

		const text = searchParams.get("text");
		if (text) {
			console.log(
				"appshare",
				`${baseUrl}/unsupported/news/text/${encodeURIComponent(text)}?${params}`,
			);
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
			headers: new Headers(req.headers),
		},
	});
}

function isBlockedUrl(url: string) {
	if (url.includes("facebook.com") || url.includes("fb.com")) {
		return "We cannot make it past the Facebook login wall 😔";
	}
	if (url.includes("instagram.com")) {
		return "We cannot make it past the Instagram login wall 😔";
	}
	if (url.includes("twitter.com") || url.includes("x.com")) {
		return "We cannot make it past the Twitter/X login wall 😔";
	}
	if (url.includes("youtube.com") || url.includes("youtu.be")) {
		return "We currently do not support YouTube videos 😔";
	}
	if (url.includes("google.com")) {
		return "We currently do not support Google content 😔";
	}
	return undefined;
}
