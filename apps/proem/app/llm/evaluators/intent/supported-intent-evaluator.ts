import { Run } from "langsmith";
import { EvaluationResult, RunEvaluator } from "langsmith/evaluation";
import { Intent } from "../../chains/intent";
import { getOutputFromRun } from "../../helpers/evaluator-helpers";

export class SupportedIntentEvaluator implements RunEvaluator {
	async evaluateRun(run: Run): Promise<EvaluationResult> {
		const output = getOutputFromRun<Intent>(run);
		const result = SupportedIntentEvaluator.evaluate(output);
		return { key: "supported_intent", ...result };
	}

	static evaluate(output: Intent | undefined) {
		if (output === undefined) {
			throw new Error("No model output to evaluate.");
		}
		const supportedIntents: Intent[] = [
			"ANSWER_EVERYDAY_QUESTION",
			"ANSWER_FOLLOWUP_QUESTION",
			"EXPLAIN_CONCEPT",
		];
		const comment = `output: ${output}`;
		return {
			value: output,
			score: supportedIntents.includes(output) ? 1 : 0,
			comment,
		};
	}
}
