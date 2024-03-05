import { getIdentifyIntentChain } from "@/app/llm/chains/identify-intent-chain";
import { IntentEvaluator } from "@/app/llm/evaluators/intent-evaluator";
import { summariseRunResults } from "@/app/llm/helpers/summarise-result";
import { buildOpenAIModelForEvaluation } from "@/app/llm/models/openai-model";
import { runOnDataset } from "langchain/smith";
import { NextRequest } from "next/server";

export const revalidate = 1;

// Examples:
//   - http://localhost:4242/api/traces/eval/identify-intent-chain/identify-intent-1q
export async function GET(
	req: NextRequest,
	{ params }: { params: { name: string } },
) {
	console.log("params", params);
	const model = buildOpenAIModelForEvaluation("gpt-3.5-turbo-0125");
	const results = await runOnDataset(
		getIdentifyIntentChain(model),
		params.name,
		{
			evaluationConfig: {
				customEvaluators: [new IntentEvaluator()],
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
