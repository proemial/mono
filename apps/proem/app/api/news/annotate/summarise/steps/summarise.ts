import { ReferencedPaper } from "@proemial/adapters/redis/news";
import { generateFactsAndQuestions } from "../../../prompts/generate-facts-and-questions";

export async function summarise(
	url: string,
	query: string,
	transcript: string,
	title: string,
	papers: ReferencedPaper[],
) {
	try {
		const factsAndQuestions = await generateFactsAndQuestions(
			transcript,
			title,
			query,
			papers,
		);
		const {
			commentary,
			questions: qaString,
			engTitle,
		} = parseOutput(factsAndQuestions);
		const questions = qaFromString(qaString);

		return { commentary, questions, engTitle };
	} catch (e) {
		console.error("[news][summarise] failed to summarise", e);
		throw new Error("[news][summarise] failed to summarise", {
			cause: { url, error: e },
		});
	}
}

function parseOutput(factsAndQuestions: string) {
	const rawCommentary = factsAndQuestions
		.split("<task_1>")[1]
		?.split("</task_1>")[0];
	const rawQuestions = factsAndQuestions
		.split("<task_2>")[1]
		?.split("</task_2>")[0];
	const rawEnglishTitle = factsAndQuestions
		.split("<task_3>")[1]
		?.split("</task_3>")[0];

	if (!rawCommentary) {
		console.error("factsAndQuestions", factsAndQuestions);
		throw new Error("Failed to generate valid facts");
	}
	if (!rawQuestions) {
		console.error("factsAndQuestions", factsAndQuestions);
		throw new Error("Failed to generate valid questions");
	}
	if (!rawEnglishTitle) {
		console.error("factsAndQuestions", factsAndQuestions);
		throw new Error("Failed to generate English title");
	}

	const commentary = trimNewlines(rawCommentary);
	const questions = trimNewlines(rawQuestions);
	const engTitle = trimNewlines(rawEnglishTitle);

	return { commentary, questions, engTitle };
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
