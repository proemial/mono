import { Example, Run } from "langsmith";
import { EvaluationResult, RunEvaluator } from "langsmith/evaluation";
import { runOutputAsString } from "../helpers/evaluator-helpers";

export class ExpectedGuardrailOutputEvaluator implements RunEvaluator {
	async evaluateRun(run: Run, reference?: Example): Promise<EvaluationResult> {
		const actual = runOutputAsString(run);
		const expected = reference?.outputs?.output as string | undefined;
		const result = ExpectedGuardrailOutputEvaluator.evaluate(actual, expected);
		return { key: "expected_guardrail_output", ...result };
	}

	static evaluate(actual: string | undefined, expected: string | undefined) {
		if (actual === undefined) {
			throw new Error("No model output to evaluate.");
		}
		if (expected === undefined) {
			throw new Error("No expected value to compare against.");
		}
		if (expected === "") {
			// Empty expected value means user question is unsupported and we
			// want the model output to include a reason why that is.
			const comment = `expected: a reason why the question is unsupported, actual: ${actual}`;
			return {
				value: actual,
				score: actual !== "SUPPORTED" ? 1 : 0, // Anything but `SUPPORTED` is okay
				comment,
			};
		}
		const comment = `expected: ${expected}, actual: ${actual}`;
		return { value: actual, score: actual === expected ? 1 : 0, comment };
	}
}
