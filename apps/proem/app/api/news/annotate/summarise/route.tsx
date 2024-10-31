import { Redis } from "@proemial/adapters/redis";
import { NewsAnnotatorSummariseInputStep } from "@proemial/adapters/redis/news2";
import { Time } from "@proemial/utils/time";
import { NextRequest, NextResponse } from "next/server";
import { generateFactsAndQuestions } from "../../prompts/generate-facts-and-questions";

export const maxDuration = 600; // seconds

export async function POST(req: NextRequest) {
	const { url } = (await req.json()) as { url: string };

	const begin = Time.now();
	try {
		const item = await Redis.news2.get(url);
		if (
			item?.summarise ||
			!item?.papers ||
			!item.scrape?.transcript ||
			!item.query?.value
		) {
			return NextResponse.json(item);
		}
		const factsAndQuestions = await generateFactsAndQuestions(
			item.scrape?.transcript,
			item.query?.value,
			item.papers.value,
		);
		const { commentary, questions: qaString } = parseOutput(factsAndQuestions);
		const questions = qaFromString(qaString);

		const result = await Redis.news2.update(url, {
			name: "summarise",
			commentary,
			questions,
		} as NewsAnnotatorSummariseInputStep);

		return NextResponse.json(result);
	} finally {
		Time.log(begin, `[annotator][papers] ${url}`);
	}
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
