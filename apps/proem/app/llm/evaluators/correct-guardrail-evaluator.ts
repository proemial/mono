import { Example, Run } from "langsmith";
import { EvaluationResult, RunEvaluator } from "langsmith/evaluation";
import { runOutputAsString } from "../helpers/evaluator-helpers";

/**
 * This evaluator checks the "correctness" of the input guardrail.
 *
 * The guardrail either return "SUPPORTED" or a reason why the input is not
 * supported.
 */
export class CorrectGuardrailEvaluator implements RunEvaluator {
	async evaluateRun(run: Run, example?: Example): Promise<EvaluationResult> {
		const output = runOutputAsString(run);
		const expected = example?.outputs?.output as string | undefined;
		const result = CorrectGuardrailEvaluator.evaluate(output, expected);
		return { key: "correct_guardrail", ...result };
	}

	static evaluate(output: string | undefined, expected: string | undefined) {
		if (output === undefined) {
			throw new Error("No model output to evaluate.");
		}
		if (expected === undefined) {
			throw new Error("No expected value to compare against.");
		}
		if (expected === "") {
			// No expected value means unsupported user input and we want the
			// model output to include the reason why it is unsupported.
			const comment = `expected: a reason for unsupported, actual: ${output}`;
			return {
				value: output,
				score:
					output.includes("SUPPORTED") && output.split(" ").length === 1
						? 0
						: 1,
				comment,
			};
		}
		const comment = `expected: ${expected}, actual: ${output}`;
		// Score 1 if the output contains `SUPPORTED`
		return { value: output, score: output.includes(expected) ? 1 : 0, comment };
	}
}
