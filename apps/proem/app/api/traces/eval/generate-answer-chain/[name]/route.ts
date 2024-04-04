import { getGenerateAnswerChain } from "@/app/llm/chains/generate-answer-chain";
import {
	LinksEvaluator,
	ValidTitleEvaluator,
} from "@/app/llm/evaluators/link-evaluators";
import { CharCountEvaluator } from "@/app/llm/evaluators/string-evaluators";
import { summariseRunResults } from "@/app/llm/helpers/summarise-result";
import { buildOpenAIChatModel } from "@/app/llm/models/openai-model";
import { runOnDataset } from "langchain/smith";
import { NextRequest } from "next/server";

export const revalidate = 1;

// Examples:
//   - http://localhost:4242/api/traces/eval/generate-answer-chain/ask-10q5p
export async function GET(
	req: NextRequest,
	{ params }: { params: { name: string } },
) {
	console.log("params", params);
	const model = buildOpenAIChatModel("gpt-3.5-turbo-0125", "none", {
		openAIApiKey: process.env.OPENAI_API_KEY_TEST,
	});
	const results = await runOnDataset(
		getGenerateAnswerChain(model),
		params.name,
		{
			evaluationConfig: {
				customEvaluators: [
					new CharCountEvaluator(200, 400),
					new LinksEvaluator(1, 2),
					new ValidTitleEvaluator(20, 50),
				],
			},
			projectMetadata: {
				model: model.modelName,
				temperature: model.temperature,
				latest_prompt_changes: "reworked prompt",
			},
		},
	);
	const { scores, avg } = summariseRunResults(results);

	return Response.json({ avg, scores, results });
}
