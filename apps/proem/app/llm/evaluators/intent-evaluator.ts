import { EvaluationResult, RunEvaluator } from "langsmith/evaluation";
import { runOutputAsString } from "../helpers/evaluator-helpers";
import { Example, Run } from "langsmith";

export class IntentEvaluator implements RunEvaluator {
	async evaluateRun(run: Run, example?: Example): Promise<EvaluationResult> {
		const output = runOutputAsString(run);
		const expected = example?.outputs?.output as string | undefined;
		const result = IntentEvaluator.evaluate(output, expected);
		return { key: "intent", ...result };
	}

	static evaluate(output: string | undefined, expected: string | undefined) {
		if (typeof output === "undefined") {
			return { value: 0, score: 0, comment: "No model output was found" };
		}
		if (typeof expected === "undefined") {
			return { value: 0, score: 0, comment: "No expected value was found" };
		}
		const comment = `expected: ${expected}, actual: ${output}`;
		return { value: output, score: output === expected ? 1 : 0, comment };
	}
}
