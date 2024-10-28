"use server";

import { z } from "zod";
import { PrimaryItemSchema } from "./types";
import { SearchMetrics } from "@proemial/adapters/qdrant/search/papers-search";
import { generateText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";

type SearchResult = {
	papers?: QdrantPaper[] | undefined | null;
	metrics?: SearchMetrics;
};

type QdrantPaper = {
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
	const videoId = item.url.split("v=")[1];
	if (!videoId) {
		throw new Error("No video ID found");
	}
	const rawTranscript = await fetchYoutubeTranscript(videoId);
	const formattedTranscript = rawTranscript.results[0]?.content
		.filter((c) => typeof c.transcriptSegmentRenderer !== "undefined")
		.map((c) => c.transcriptSegmentRenderer?.snippet.runs[0]?.text)
		.join(", ");
	if (!formattedTranscript) {
		throw new Error("No transcript found");
	}

	console.log(formattedTranscript);

	const content = formattedTranscript; // TODO: Support article content

	// Generate search query from primary item
	const indexQuery = await generateIndexQuery(content);
	const parsedQuery = indexQuery
		.split("<search_query>")[1]
		?.split("</search_query>")[0];
	if (!parsedQuery) {
		throw new Error("Failed to parse search query");
	}
	console.log({ parsedQuery: trimNewlines(parsedQuery) });

	// Search index for papers that match the search query
	const { papers } = await searchIndex(parsedQuery, "2024-10-01"); // TODO: Make date adjustable
	if (!papers) {
		throw new Error("No papers found");
	}

	// Generate facts and questions from news article and papers
	const factsAndQuestions = await generateFactsAndQuestions(content, papers);

	const facts = factsAndQuestions.split("<task_1>")[1]?.split("</task_1>")[0];
	const questions = factsAndQuestions
		.split("<task_2>")[1]
		?.split("</task_2>")[0];
	if (!facts || !questions) {
		throw new Error("Failed to parse facts and questions");
	}
	console.log({
		facts: trimNewlines(facts),
		questions: trimNewlines(questions),
	});

	return {
		facts: trimNewlines(facts),
		questions: trimNewlines(questions),
		papers,
		artwork: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
	};
}

const generateIndexQuery = async (newsArticle: string): Promise<string> => {
	const { text } = await generateText({
		model: anthropic("claude-3-5-sonnet-20240620"),
		messages: [
			{
				role: "user",
				content: `
You will be given a news article to analyze. Your task is to formulate a single search query that includes the key topics of the article. The search query will be used to find scientific research articles that support or are otherwise relevant to these topics, to establish the trustworthiness of the news article.

<article>${newsArticle}</article>

To complete this task, follow these steps:

1. Carefully read through the entire article.
2. Identify the main topic or theme of the article.
3. Look for the most important ideas, facts, or arguments that support the main topic.
4. Consider any significant data, statistics, or quotes that stand out.
5. Pay attention to the introduction and conclusion, as they often contain key information.
6. Only include the search query in your response, not any other text.

Guidelines for selecting key points:
- Choose points that are central to the article's main argument or theme.
- Include information that would be essential for someone to understand the core message of the article.
- Prioritize unique or surprising information over common knowledge.
- Ensure the selected points give a balanced representation of the article's content.

Write your response in the following format, using commas to partition the search query:

<search_query>
[part 1, part 2, part 3...]
</search_query>
			`,
			},
		],
	});
	return text;
};

const generateFactsAndQuestions = async (
	newsArticle: string,
	papers: QdrantPaper[],
): Promise<string> => {
	const { text } = await generateText({
		model: anthropic("claude-3-5-sonnet-20240620"),
		messages: [
			{
				role: "user",
				content: `
You are given a news article and the abstracts of ${papers.length} scientific research papers:

<news_article>
${newsArticle}
</news_article>

<research_papers>
${papers.map((paper, index) => `<abstract_${index + 1}>${paper.abstract}</abstract_${index + 1}>`).join("\n")}
</research_papers>

Now, complete these two tasks, one after the other:

<task_1>
Exclusively using topics and discoveries from the ${papers.length} abstracts, list 3 scientific facts that relate to the key topics discussed in the news article.

The facts must be short, fascinating and presented using layman's terminology, in a way that makes the reader curious to learn more. It's imperative that you include references to the abstracts when quoting text or sources, using supertext.
</task_1>

<task_2>
Provide 3 interesting scientific questions for the news article that can be answered based on discoveries in the abstracts. Make the questions easy to understand, in a voice of an engaging news journalist, using a maximum of 10 words.

Answer each question in a short and intriguing way, using layman's terminology, that makes the reader curious to learn more. It's imperative that you include references to the abstracts when quoting text or sources, using supertext.
</task_2>
			`,
			},
		],
	});
	return text;
};

// Trims newlines from the beginning and end of a string
const trimNewlines = (text: string): string => {
	return text.replace(/^\n+|\n+$/g, "");
};

const searchIndex = async (
	query: string,
	from: string,
): Promise<SearchResult> => {
	const result = await fetch("https://index.proem.ai/api/search", {
		method: "POST",
		body: JSON.stringify({ query, from }),
	});

	return await result.json();
};

type RawTranscripts = {
	results: {
		content: {
			transcriptSegmentRenderer: { snippet: { runs: { text: string }[] } };
		}[];
	}[];
};

const fetchYoutubeTranscript = async (
	videoId: string,
): Promise<RawTranscripts> => {
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
