import { inputGuardrailChain } from "@/app/llm/chains/input-guardrail-chain";
import { ExpectedGuardrailOutputEvaluator } from "@/app/llm/evaluators/expected-guardrail-output-evaluator";
import { summariseRunResults } from "@/app/llm/helpers/summarise-result";
import { buildOpenAIChatModel } from "@/app/llm/models/openai-model";
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
	const model = buildOpenAIChatModel("gpt-3.5-turbo-0125", "none", {
		openAIApiKey: process.env.OPENAI_API_KEY_TEST,
	});
	const results = await runOnDataset(inputGuardrailChain(model), params.name, {
		evaluationConfig: {
			customEvaluators: [new ExpectedGuardrailOutputEvaluator()],
		},
		projectMetadata: {
			model: model.modelName,
			temperature: model.temperature,
		},
	});
	const { scores, avg } = summariseRunResults(results);
	return Response.json({ avg, scores, results });
}
