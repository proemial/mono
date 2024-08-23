import { getSelectRelevantPapersChain } from "@/app/llm/chains/fetch-papers/select-relevant-papers-chain";
import { PaperIdEvaluator } from "@/app/llm/evaluators/select-paper-evaluators";
import { summariseRunResults } from "@/app/llm/helpers/summarise-result";
import { buildOpenAIChatModel } from "@/app/llm/models/openai-model";
import { env } from "@/env/server";
import { runOnDataset } from "langchain/smith";
import { NextRequest } from "next/server";

export const revalidate = 1;

export async function GET(
	_req: NextRequest,
	{ params }: { params: { name: string } },
) {
	const model = buildOpenAIChatModel("gpt-3.5-turbo-0125", "none", {
		openAIApiKey: env.OPENAI_API_KEY_TEST,
	});
	const results = await runOnDataset(
		getSelectRelevantPapersChain(model),
		params.name,
		{
			evaluationConfig: {
				customEvaluators: [new PaperIdEvaluator()],
			},
			projectMetadata: {
				model: model.modelName,
				temperature: model.temperature,
			},
		},
	);
	const { scores, avg } = summariseRunResults(results);

	return Response.json({ avg, scores, results });
}
