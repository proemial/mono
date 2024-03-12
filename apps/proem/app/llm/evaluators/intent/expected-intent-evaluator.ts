import { EvaluationResult, RunEvaluator } from "langsmith/evaluation";
import { runOutputAsString } from "../../helpers/evaluator-helpers";
import { Example, Run } from "langsmith";

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
		const comment = `expected: ${expected}, actual: ${output}`;
		return { value: output, score: output === expected ? 1 : 0, comment };
	}
}
