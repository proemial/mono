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
	return (
		text.match(urlRegExp)?.map((match) => {
			const url = new URL(match);

			const { host, pathname: path, searchParams } = url;
			const query = searchParams.get("title")?.replaceAll("+", " ") ?? "";

			return { host, path, query };
		}) ?? []
	);
}

const relativeLink = /\/oa\/W[0-9]+/;
const relativeATagLinksWithOptionalQueryParam =
	/<a\s+href="\/oa\/W[0-9]+(\?title=[^&"]*)?">.*?<\/a>/g;
const relativeMarkdownLinksWithOptionalQueryParam =
	/\[.*?\]\(\/oa\/W[0-9]+(\?title=[^)\]]*)?\)/g;
const titleQueryParam = /(?<=title=)[^&\)]+/;

export function extractATags(text: string) {
	const matches = text.match(relativeATagLinksWithOptionalQueryParam);
	return matches ?? [];
}

export function extractMarkdownLinks(text: string) {
	const matches = text.match(relativeMarkdownLinksWithOptionalQueryParam);
	return matches ?? [];
}

export const extractMarkdownLinkTitle = (text: string) =>
	text.match(titleQueryParam)?.map((match) => match.replaceAll("+", " "))[0];

export const extractFirstRelativeLink = (text: string) =>
	text.match(relativeLink)?.[0];
