import { NextRequest } from "next/server";
import { runOnDataset } from "langchain/smith";
import { answerEngineChain } from "@/app/llm/chains/answer-engine-chain";
import { CharCountEvaluator } from "@/app/llm/evaluators/string-evaluators";
import { summariseRunResults } from "@/app/llm/helpers/summarise-result";
import {
	LinkCountEvaluator,
	ValidLinkEvaluator,
	ValidTitleEvaluator,
	LinksEvaluator,
} from "@/app/llm/evaluators/link-evaluators";

export const revalidate = 1;

// http://127.0.0.1/api/eval/ASK-OnePaperDataSet
// http://127.0.0.1/api/eval/ASK-RefDataSet
export async function GET(
	req: NextRequest,
	{ params }: { params: { name: string } },
) {
	console.log("params", params);
	const results = await runOnDataset(answerEngineChain, params.name, {
		evaluators: [
			new CharCountEvaluator(200, 400),
			new LinksEvaluator(1, 2),
			new LinkCountEvaluator(1, 2),
			new ValidLinkEvaluator(),
			new ValidTitleEvaluator(20, 50),
		],
	});
	const { scores, avg } = summariseRunResults(results);

	return Response.json({ avg, scores, results });
}
