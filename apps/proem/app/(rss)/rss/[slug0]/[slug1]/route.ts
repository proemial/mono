import { NextRequest } from "next/server";
import { rssFeed } from "../../../rss";

export async function GET(
	req: NextRequest,
	{ params }: { params: { slug0: string; slug1: string } },
) {
	const feed = await rssFeed(req.url, params.slug0, params.slug1);

	return new Response(feed.rss2(), {
		headers: { "Content-Type": "text/xml" },
	});
}
