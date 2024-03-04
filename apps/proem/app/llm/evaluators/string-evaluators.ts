import { Run } from "@langchain/core/tracers/base";
import { EvaluationResult, RunEvaluator } from "langsmith/evaluation";
import { calculateDiffScore, pickOutput } from "../helpers/evaluator-helpers";

export class CharCountEvaluator implements RunEvaluator {
	constructor(
		private min: number,
		private max: number,
	) {}

	async evaluateRun(run: Run): Promise<EvaluationResult> {
		const output = pickOutput(run);
		const result = CharCountEvaluator.evaluate(this.min, this.max, output);

		return { key: "chars", ...result };
	}

	static evaluate(min: number, max: number, text?: string) {
		const value = text?.trim().length ?? 0;
		const score = calculateDiffScore(min, max, value);
		const comment = `expected: ${min}-${max}, actual: ${value}`;

		return { value, score, comment };
	}
}
