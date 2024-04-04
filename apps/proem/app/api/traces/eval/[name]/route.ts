import { answerEngineChain } from "@/app/llm/chains/answer-engine-chain";
import {
	LinkCountEvaluator,
	LinksEvaluator,
	ValidLinkEvaluator,
	ValidTitleEvaluator,
} from "@/app/llm/evaluators/link-evaluators";
import { CharCountEvaluator } from "@/app/llm/evaluators/string-evaluators";
import { summariseRunResults } from "@/app/llm/helpers/summarise-result";
import { buildOpenAIChatModel } from "@/app/llm/models/openai-model";
import { runOnDataset } from "langchain/smith";
import { NextRequest } from "next/server";

export const revalidate = 1;

// http://127.0.0.1/api/traces/eval/ASK-OnePaperDataSet
// http://127.0.0.1/api/traces/eval/ASK-RefDataSet
export async function GET(
	req: NextRequest,
	{ params }: { params: { name: string } },
) {
	console.log("params", params);
	const model = buildOpenAIChatModel("gpt-3.5-turbo-0125", "none", {
		openAIApiKey: process.env.OPENAI_API_KEY_TEST,
	});
	const results = await runOnDataset(answerEngineChain, params.name, {
		evaluationConfig: {
			customEvaluators: [
				new CharCountEvaluator(200, 400),
				new LinksEvaluator(1, 2),
				new LinkCountEvaluator(1, 2),
				new ValidLinkEvaluator(),
				new ValidTitleEvaluator(20, 50),
			],
		},
		projectMetadata: {
			model: model.modelName,
			temperature: model.temperature,
		},
	});
	const { scores, avg } = summariseRunResults(results);

	return Response.json({ avg, scores, results });
}
