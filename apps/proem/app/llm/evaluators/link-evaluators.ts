import { EvaluationResult, RunEvaluator } from "langsmith/evaluation";
import { Run } from "@langchain/core/tracers/base";
import {
	calculateDiffScore,
	extractLinks,
	runOutputAsString,
	urlRegExp,
	extractFirstRelativeLink,
	extractMarkdownLinks,
	extractMarkdownLinkTitle,
} from "../helpers/evaluator-helpers";
import { findRunPaperLinks } from "@/app/llm/helpers/find-run";

export class LinksEvaluator implements RunEvaluator {
	constructor(
		private min: number,
		private max: number,
	) {}

	async evaluateRun(run: Run): Promise<EvaluationResult> {
		const output = runOutputAsString(run) ?? "";
		const links = findRunPaperLinks(run);

		const result = LinksEvaluator.evaluate(this.min, this.max, output, links);

		return { key: "links", ...result };
	}

	static evaluate(
		min: number,
		max: number,
		text: string,
		paperLinks: string[],
	) {
		const answerLinks = extractMarkdownLinks(text);
		const matches = answerLinks.filter((link) => {
			const relativeLink = extractFirstRelativeLink(link);
			return relativeLink ? paperLinks.includes(relativeLink) : false;
		});

		const value = matches.length;
		const score = calculateDiffScore(min, max, matches.length);
		const comment = `expected: ${min}-${max}, actual: ${JSON.stringify({
			answerLinks,
			paperLinks,
		})}`;

		return { value, score, comment };
	}
}

/**
 * @deprecated: Not updated to Markdown links, use `LinksEvaluator` instead.
 */
export class LinkCountEvaluator implements RunEvaluator {
	constructor(
		private min: number,
		private max: number,
	) {}

	async evaluateRun(run: Run): Promise<EvaluationResult> {
		const output = runOutputAsString(run);
		const result = LinkCountEvaluator.evaluate(this.min, this.max, output);

		return { key: "links_count", ...result };
	}

	static evaluate(min: number, max: number, text?: string) {
		const sanitised = text ?? "";

		const value = sanitised.match(urlRegExp)?.length ?? 0;
		const score = calculateDiffScore(min, max, value);
		const comment = `expected: ${min}-${max}, actual: ${value}`;

		return { value, score, comment };
	}
}

/**
 * @deprecated: Not updated to Markdown links, use `LinksEvaluator` instead.
 */
export class ValidLinkEvaluator implements RunEvaluator {
	async evaluateRun(run: Run): Promise<EvaluationResult> {
		const output = runOutputAsString(run) ?? "";
		const links = findRunPaperLinks(run);

		const result = ValidLinkEvaluator.evaluate(output, links);

		return { key: "links_valid", ...result };
	}

	static evaluate(text: string, paperLinks: string[]) {
		const answerLinks = extractLinks(text);
		const linkCount = answerLinks.length;

		const matches = answerLinks.filter(
			(url) => paperLinks.includes(url.path) && url.host === "proem.ai",
		);

		const value = matches.length;
		const score = calculateDiffScore(linkCount, linkCount, matches.length);
		const comment = `expected: ${linkCount}-${linkCount}, actual: ${JSON.stringify(
			{
				answerLinks,
				paperLinks,
			},
		)}`;

		return { value, score, comment };
	}
}

export class ValidTitleEvaluator implements RunEvaluator {
	constructor(
		private min: number,
		private max: number,
	) {}

	async evaluateRun(run: Run): Promise<EvaluationResult> {
		const output = runOutputAsString(run) ?? "";

		const result = ValidTitleEvaluator.evaluate(this.min, this.max, output);

		return { key: "links_titles", ...result };
	}

	static evaluate(min: number, max: number, text: string) {
		const links = extractMarkdownLinks(text);
		const titles = links.map(extractMarkdownLinkTitle);
		// biome-ignore lint/style/noNonNullAssertion: undefined is filtered out
		const values = titles.filter((title) => !!title).map((title) => title!.length);
		const scores = values.map((length) => calculateDiffScore(min, max, length));

		const value =
			values.length > 0
				? values.reduce((a, b) => a + b, 0) / values.length //avg
				: 0;

		const score =
			scores.length > 0
				? scores.reduce((a, b) => a + b, 0) / scores.length //avg
				: calculateDiffScore(min, max, 0);

		const comment = `expected: ${min}-${max}, actual: ${JSON.stringify({
			titles,
		})}`;

		return { value, score, comment };
	}
}
