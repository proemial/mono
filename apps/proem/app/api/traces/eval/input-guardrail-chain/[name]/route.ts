import { inputGuardrailChainWithModel } from "@/app/llm/chains/input-guardrail-chain";
import { ExpectedGuardrailOutputEvaluator } from "@/app/llm/evaluators/expected-guardrail-output-evaluator";
import { summariseRunResults } from "@/app/llm/helpers/summarise-result";
import { buildOpenAIModelForEvaluation } from "@/app/llm/models/openai-model";
import { runOnDataset } from "langchain/smith";
import { NextRequest } from "next/server";

export const revalidate = 1;

// Examples:
//   - http://localhost:4242/api/traces/eval/input-guardrail-chain/decline-if-unsupported-question
export async function GET(
	req: NextRequest,
	{ params }: { params: { name: string } },
) {
	console.log("params", params);
	const model = buildOpenAIModelForEvaluation("gpt-3.5-turbo-0125", undefined);
	const results = await runOnDataset(
		inputGuardrailChainWithModel(model),
		params.name,
		{
			evaluationConfig: {
				customEvaluators: [new ExpectedGuardrailOutputEvaluator()],
			},
			projectMetadata: {
				model: model.modelName,
				temperature: model.temperature,
				latest_prompt_changes: "none",
			},
		},
	);
	const { scores, avg } = summariseRunResults(results);
	return Response.json({ avg, scores, results });
}
