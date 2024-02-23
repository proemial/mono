import { Run } from "@langchain/core/tracers/base";

type StringOutputParserOutput = {
	output: string;
};

export function runOutputAsString(run: Run) {
	return (run.outputs as StringOutputParserOutput).output;
}

export function calculateDiffScore(min: number, max: number, value?: number) {
	const diff = countDiff(min, max, value);
	const percent = (max === min ? max : max - min) / 100;
	const precisionScore = 1 - diff / percent / 100;
	const score = diff ? Number((precisionScore || 0).toFixed(3)) : 1;
	return Math.max(0, score);
}

export function countDiff(min: number, max: number, value?: number): number {
	if (value === undefined || Number.isNaN(value)) {
		return 0;
	}

	if (value >= min && value <= max) {
		return 0;
	}

	if (value < min) {
		return min - value;
	}

	return value - max;
}

export const urlRegExp = /https?:\/\/[^\s$.?#].[^\s]*[a-zA-Z0-9]/g;

export function extractLinks(text: string) {
	console.log("text", text);
	return (
		text.match(urlRegExp)?.map((match) => {
			console.log("match", match);
			const url = new URL(match);

			const { host, pathname: path, searchParams } = url;
			const query = searchParams.get("title")?.replaceAll("+", " ") ?? "";

			return { host, path, query };
		}) ?? []
	);
}
