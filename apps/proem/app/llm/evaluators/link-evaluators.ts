import { EvaluationResult, RunEvaluator } from "langsmith/evaluation";
import { Run } from "@langchain/core/tracers/base";
import { runOutputAsString, countDiff } from "../helpers/evaluator-helpers";

export class LinkCountEvaluator implements RunEvaluator {
	constructor(
		private min: number,
		private max: number,
	) {}

	async evaluateRun(run: Run): Promise<EvaluationResult> {
		const output = runOutputAsString(run);
		const result = LinkCountEvaluator.evaluate(this.min, this.max, output);

		return { key: "LinkCount", ...result };
	}

	static evaluate(min: number, max: number, text?: string) {
		const sanitised = text ?? "";

		const urlPattern = /https?:\/\/[^\s$.?#].[^\s]*/g;
		const value = sanitised.match(urlPattern)?.length ?? 0;

		const diff = countDiff(min, max, value);
		const score = 1 - diff / 10;
		const comment = `Expected range: ${min}-${max}`;

		const result = { value, score, comment };

		console.log(result);
		return result;
	}
}
