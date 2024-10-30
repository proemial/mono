"use server";

import { z } from "zod";
import { generateFactsAndQuestions } from "./prompts/generate-facts-and-questions";
import { generateIndexSearchQuery } from "./prompts/generate-index-search-query";
import { PrimaryItemSchema } from "./types";
import { NewsItem, ReferencedPaper } from "@proemial/adapters/redis/news";
import { Redis } from "@proemial/adapters/redis";

type SearchResult = {
	papers: QdrantPaper[];
};

export type QdrantPaper = ReferencedPaper & {
	score: number;
	features: Feature[];
};

type Feature = {
	id: string;
	label: string;
	score: number;
	type: "topic" | "keyword" | "concept";
};

export type AnnotateWithScienceResponse = {
	output?: NewsItem;
	error?: string;
};

export async function annotateWithScienceAction(
	item: z.infer<typeof PrimaryItemSchema>,
): Promise<AnnotateWithScienceResponse> {
	try {
		// Scrape the primary URL to get the transcript and artwork URL
		const { transcript, artworkUrl, title } = await scrape(item.url);

		// Generate search query for index from primary item transcript
		const query = await buildQuery(transcript);

		// Search index for papers that match the query
		const { papers } = await fetchPapersFromIndex(query, "2024-01-01"); // TODO: Make date adjustable

		// Generate facts and questions from papers, for the primary item transcript
		const factsAndQuestions = await generateFactsAndQuestions(
			transcript,
			query,
			papers,
		);

		const { commentary, questions } = parseOutput(factsAndQuestions);
		const { hostname } = new URL(item.url);
		const content = {
			source: {
				url: item.url,
				text: transcript,
				image: artworkUrl as string,
				name: hostname.replace(/^[^.]+\./, ""), // remove subdomain
				logo: `https://${hostname}.com/favicon.ico`,
			},
			references: papers,
			generated: {
				title,
				background: commentary,
				questions: qaFromString(questions),
			},
			_: {
				public: false,
			},
		};

		await Redis.news.set(item.url, content);

		return {
			output: content,
		};
	} catch (error) {
		return {
			error:
				error instanceof Error ? error.message : "An unknown error occurred",
		};
	}
}

function qaFromString(text: string): Array<[string, string]> {
	// Split text into lines and filter out empty lines
	const lines = text.split("\n").filter((line) => line.trim());
	const pairs: Array<[string, string]> = [];

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i]?.trim() as string;
		// Check if line starts with a number and contains a question
		if (/^\d+\./.test(line) && line.includes("?")) {
			const question = line.replace(/^\d+\.\s*/, "").trim();
			// Get the next line as the answer if it exists
			const answer = (lines[i + 1] || "").trim();
			if (answer && !answer.startsWith("d+.")) {
				pairs.push([question, answer]);
				i++; // Skip the answer line in next iteration
			}
		}
	}

	return pairs;
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

async function buildQuery(transcript: string) {
	const indexQuery = await generateIndexSearchQuery(transcript);
	const parsedQuery = indexQuery
		.split("<search_query>")[1]
		?.split("</search_query>")[0];
	if (!parsedQuery) {
		throw new Error("Failed to parse search query");
	}
	console.log("[query]", trimNewlines(parsedQuery));

	return parsedQuery;
}

function parseOutput(factsAndQuestions: string) {
	const rawFacts = factsAndQuestions
		.split("<task_1>")[1]
		?.split("</task_1>")[0];
	const rawCommentary = factsAndQuestions
		.split("<task_2>")[1]
		?.split("</task_2>")[0];
	const rawQuestions = factsAndQuestions
		.split("<task_3>")[1]
		?.split("</task_3>")[0];

	if (!rawFacts || !rawCommentary || !rawQuestions) {
		throw new Error("Failed to generate valid facts and questions");
	}

	const facts = trimNewlines(rawFacts);
	const commentary = trimNewlines(rawCommentary);
	const questions = trimNewlines(rawQuestions);

	console.log("[output]", {
		facts: `[${facts.length}] ${facts.slice(0, 50)} ...`,
		commentary: `[${commentary.length}] ${commentary.slice(0, 50)} ...`,
		questions: `[${questions.length}] ${questions.slice(0, 50)} ...`,
	});

	return { facts, commentary, questions };
}

// Trims newlines from the beginning and end of a string
const trimNewlines = (text: string): string => {
	return text.replace(/^\n+|\n+$/g, "");
};

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

const fetchPapersFromIndex = async (
	query: string,
	from: string,
): Promise<SearchResult> => {
	const result = await fetch("https://index.proem.ai/api/search", {
		method: "POST",
		body: JSON.stringify({ query, from, extended: true }),
	});

	const papers = (await result.json()) as SearchResult;

	if (!papers) {
		throw new Error("No papers found");
	}

	console.log("[papers]", papers.papers.length);
	return papers;
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
