import { EvaluationResult, RunEvaluator } from "langsmith/evaluation";
import { runOutputAsString } from "../helpers/evaluator-helpers";
import { Example, Run } from "langsmith";

export class IntentEvaluator implements RunEvaluator {
	async evaluateRun(run: Run, example?: Example): Promise<EvaluationResult> {
		const output = runOutputAsString(run);
		const reference = example?.outputs?.output as string | undefined;
		const result = IntentEvaluator.evaluate(output, reference);
		return { key: "intent", ...result };
	}

	static evaluate(output: string | undefined, reference: string | undefined) {
		if (typeof output === "undefined") {
			return { value: 0, score: 0, comment: "No model output was found" };
		}
		if (typeof reference === "undefined") {
			return { value: 0, score: 0, comment: "No dataset reference was found" };
		}
		const comment = `expected: ${reference}, actual: ${output}`;
		return { value: output, score: output === reference ? 1 : 0, comment };
	}
}
