import { Example, Run } from "langsmith";
import { EvaluationResult, RunEvaluator } from "langsmith/evaluation";
import { runOutputAsString } from "../helpers/evaluator-helpers";

export class ExpectedIntentEvaluator implements RunEvaluator {
	async evaluateRun(run: Run, example?: Example): Promise<EvaluationResult> {
		const output = runOutputAsString(run);
		const expected = example?.outputs?.output as string | undefined;
		const result = ExpectedIntentEvaluator.evaluate(output, expected);
		return { key: "expected_intent", ...result };
	}

	static evaluate(output: string | undefined, expected: string | undefined) {
		if (output === undefined) {
			throw new Error("No model output to evaluate.");
		}
		if (expected === undefined) {
			throw new Error("No expected value to compare against.");
		}
		if (expected === "") {
			// No expected value means unsupported intent and we want the model to provide a reason.
			const comment = `expected: reason for unsupported, actual: ${output}`;
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
		return { value: output, score: output.includes(expected) ? 1 : 0, comment }; // Score 1 if the output contains `SUPPORTED`
	}
}
