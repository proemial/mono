import { EvaluationResult, RunEvaluator } from "langsmith/evaluation";
import { Run } from "@langchain/core/tracers/base";
import { runOutputAsString, countDiff } from "../helpers/evaluator-helpers";

export class WordCountEvaluator implements RunEvaluator {
	constructor(
		private min: number,
		private max: number,
	) {}

	async evaluateRun(run: Run): Promise<EvaluationResult> {
		const output = runOutputAsString(run);
		const result = WordCountEvaluator.evaluate(this.min, this.max, output);

		return { key: "WordCount", ...result };
	}

	static evaluate(min: number, max: number, text?: string) {
		const value = text?.trim().length ? text?.split(" ").length : 0;
		const diff = countDiff(min, max, value);
		const score = 1 - diff / 20;
		const comment = `Expected range: ${min}-${max}`;

		return { value, score, comment };
	}
}
