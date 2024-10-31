import { Redis } from "@proemial/adapters/redis";
import {
	NewsAnnotatorInitInputStep,
	NewsAnnotatorScrapeInputStep,
} from "@proemial/adapters/redis/news2";
import { Time } from "@proemial/utils/time";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 10 * 60; // seconds

export async function POST(req: NextRequest) {
	const { url } = (await req.json()) as { url: string };

	const begin = Time.now();
	try {
		const item = await Redis.news2.get(url);
		if (item?.scrape) {
			return NextResponse.json(item);
		}

		const { hostname } = new URL(url);
		await Redis.news2.set(url, {
			url,
			name: "init",
			host: hostname.replace(/^[^.]+\./, ""), // remove subdomain
			logo: `https://${hostname}.com/favicon.ico`,
		} as NewsAnnotatorInitInputStep);

		const { transcript, artworkUrl, title } = await scrape(url);
		const result = await Redis.news2.update(url, {
			name: "scrape",
			transcript,
			artworkUrl,
			title,
		} as NewsAnnotatorScrapeInputStep);

		return NextResponse.json(result);
	} finally {
		Time.log(begin, `[annotator][scrape] ${url}`);
	}
}

async function scrape(url: string) {
	const itemType =
		url.includes("youtube.com") || url.includes("youtu.be")
			? "youtube"
			: "article";

	const output =
		itemType === "youtube" ? await parseVideo(url) : await parseArticle(url);

	const transcript = output.transcript.replaceAll("\n", " ");
	console.log(
		"[scrape]",
		`[${transcript.length}]: ${transcript.slice(0, 50)} ...`,
		!!output.artworkUrl,
	);

	return output;
}

type ParserResult = {
	title: string;
	transcript: string;
	artworkUrl: string | undefined;
};

const parseVideo = async (url: string): Promise<ParserResult> => {
	const videoId = url.split("v=")[1];
	if (!videoId) {
		throw new Error("No video ID found");
	}
	const rawTranscript = await fetchYoutubeTranscript(videoId);
	if (!rawTranscript.results?.at(0)?.content) {
		throw new Error("No youtube content found");
	}
	const formattedTranscript = rawTranscript.results[0]?.content
		.filter((c) => typeof c.transcriptSegmentRenderer !== "undefined")
		.map((c) => c.transcriptSegmentRenderer?.snippet.runs[0]?.text)
		.join(", ");
	if (!formattedTranscript) {
		throw new Error("No transcript available");
	}
	const title = "TODO: Get title from parsed output";

	return {
		transcript: formattedTranscript,
		artworkUrl: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
		title,
	};
};

const parseArticle = async (url: string): Promise<ParserResult> => {
	const rawTranscript = await fetchUniversalArticleTranscript(url);
	const transcript = rawTranscript.objects.map((o) => o.text).join("\n");
	// TODO: Fix video placeholders
	const artworkUrl =
		rawTranscript.objects[0]?.html.match(/<video[^>]*poster="([^"]+)"/)?.[1] ??
		rawTranscript.objects[0]?.html.match(/<img[^>]*src="([^"]+)"/)?.[1];
	console.log("[artworkUrl]", artworkUrl);

	const title = rawTranscript.objects[0]?.title ?? "";

	return {
		transcript,
		artworkUrl,
		title,
	};
};

type YouTubeTranscriptPayload = {
	results: {
		content: {
			transcriptSegmentRenderer: { snippet: { runs: { text: string }[] } };
		}[];
	}[];
};

const fetchYoutubeTranscript = async (
	videoId: string,
): Promise<YouTubeTranscriptPayload> => {
	const result = await fetch("https://realtime.oxylabs.io/v1/queries", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Basic ${Buffer.from(
				`${process.env.OXYLABS_USERNAME}:${process.env.OXYLABS_PASSWORD}`,
			).toString("base64")}`,
		},
		body: JSON.stringify({ source: "youtube_transcript", query: videoId }),
	});

	return await result.json();
};

type ArticleTranscriptPayload = {
	objects: {
		title: string;
		text: string;
		author: string;
		date: string;
		html: string;
	}[];
};

const fetchUniversalArticleTranscript = async (
	url: string,
): Promise<ArticleTranscriptPayload> => {
	const result = await fetch(
		`https://api.diffbot.com/v3/article?url=${url}&token=${process.env.DIFFBOT_API_TOKEN}`,
		{
			method: "GET",
			headers: { accept: "application/json" },
		},
	);

	return await result.json();
};
