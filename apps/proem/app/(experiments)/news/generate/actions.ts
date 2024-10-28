"use server";

import { SearchMetrics } from "@proemial/adapters/qdrant/search/papers-search";
import { z } from "zod";
import { generateFactsAndQuestions } from "./prompts/generate-facts-and-questions";
import { generateIndexSearchQuery } from "./prompts/generate-index-search-query";
import { PrimaryItemSchema } from "./types";

type SearchResult = {
	papers?: QdrantPaper[] | undefined | null;
	metrics?: SearchMetrics;
};

export type QdrantPaper = {
	score: number;
	title: string;
	created: string;
	abstract: string;
	id: string;
	features: Feature[];
};

type Feature = {
	id: string;
	label: string;
	score: number;
	type: "topic" | "keyword" | "concept";
};

export async function annotateWithScienceAction(
	item: z.infer<typeof PrimaryItemSchema>,
) {
	const { transcript, artworkUrl } =
		item.type === "youtube"
			? await parseVideo(item.url)
			: await parseArticle(item.url);

	// Generate search query for index from primary item transcript
	const indexQuery = await generateIndexSearchQuery(transcript);
	const parsedQuery = indexQuery
		.split("<search_query>")[1]
		?.split("</search_query>")[0];
	if (!parsedQuery) {
		throw new Error("Failed to parse search query");
	}
	console.log({ parsedQuery: trimNewlines(parsedQuery) });

	// Search index for papers that match the query
	const { papers } = await fetchPapersFromIndex(parsedQuery, "2024-10-01"); // TODO: Make date adjustable
	if (!papers) {
		throw new Error("No papers found");
	}

	// Generate facts and questions from papers, for the primary item transcript
	const factsAndQuestions = await generateFactsAndQuestions(transcript, papers);

	const facts = factsAndQuestions.split("<task_1>")[1]?.split("</task_1>")[0];
	const questions = factsAndQuestions
		.split("<task_2>")[1]
		?.split("</task_2>")[0];
	if (!facts || !questions) {
		throw new Error("Failed to generate valid facts and questions");
	}
	console.log({
		facts: trimNewlines(facts),
		questions: trimNewlines(questions),
	});

	return {
		facts: trimNewlines(facts),
		questions: trimNewlines(questions),
		papers,
		artwork: artworkUrl,
	};
}

// Trims newlines from the beginning and end of a string
const trimNewlines = (text: string): string => {
	return text.replace(/^\n+|\n+$/g, "");
};

type ParserResult = {
	transcript: string;
	artworkUrl: string | undefined;
};

const parseVideo = async (url: string): Promise<ParserResult> => {
	const videoId = url.split("v=")[1];
	if (!videoId) {
		throw new Error("No video ID found");
	}
	const rawTranscript = await fetchYoutubeTranscript(videoId);
	const formattedTranscript = rawTranscript.results[0]?.content
		.filter((c) => typeof c.transcriptSegmentRenderer !== "undefined")
		.map((c) => c.transcriptSegmentRenderer?.snippet.runs[0]?.text)
		.join(", ");
	if (!formattedTranscript) {
		throw new Error("No transcript available");
	}
	return {
		transcript: formattedTranscript,
		artworkUrl: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
	};
};

const parseArticle = async (url: string): Promise<ParserResult> => {
	const rawTranscript = await fetchUniversalArticleTranscript(url);
	const transcript = rawTranscript.objects.map((o) => o.text).join("\n");
	const artworkUrl = rawTranscript.objects[0]?.html.match(
		/<img[^>]*src="([^"]+)"/,
	)?.[1];

	return {
		transcript,
		artworkUrl,
	};
};

const fetchPapersFromIndex = async (
	query: string,
	from: string,
): Promise<SearchResult> => {
	const result = await fetch("https://index.proem.ai/api/search", {
		method: "POST",
		body: JSON.stringify({ query, from }),
	});

	return await result.json();
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
