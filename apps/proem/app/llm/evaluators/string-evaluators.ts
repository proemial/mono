import {
	calculateDiffScore,
	runOutputAsString,
} from "@/app/llm/helpers/evaluator-helpers";
import { Run } from "@langchain/core/tracers/base";
import { EvaluationResult, RunEvaluator } from "langsmith/evaluation";

export class CharCountEvaluator implements RunEvaluator {
	constructor(
		private min: number,
		private max: number,
	) {}

	async evaluateRun(run: Run): Promise<EvaluationResult> {
		const output = runOutputAsString(run);
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
