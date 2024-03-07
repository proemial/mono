import { NextRequest } from "next/server";
import { runOnDataset } from "langchain/smith";
import {
	answerEngineChain,
	answerEngineExperimental,
} from "@/app/llm/chains/answer-engine-chain";
import { CharCountEvaluator } from "@/app/llm/evaluators/string-evaluators";
import { summariseRunResults } from "@/app/llm/helpers/summarise-result";
import {
	LinkCountEvaluator,
	ValidLinkEvaluator,
	ValidTitleEvaluator,
	LinksEvaluator,
} from "@/app/llm/evaluators/link-evaluators";
import { getFeatureFlag } from "@/app/components/feature-flags/server-flags";

export const revalidate = 1;

// http://127.0.0.1/api/traces/eval/ASK-OnePaperDataSet
// http://127.0.0.1/api/traces/eval/ASK-RefDataSet
export async function GET(
	req: NextRequest,
	{ params }: { params: { name: string } },
) {
	console.log("params", params);

	const validateIntent = await getFeatureFlag("validateAskIntent");
	const chain = validateIntent ? answerEngineExperimental : answerEngineChain;

	const results = await runOnDataset(chain, params.name, {
		evaluationConfig: {
			customEvaluators: [
				new CharCountEvaluator(200, 400),
				new LinksEvaluator(1, 2),
				new LinkCountEvaluator(1, 2),
				new ValidLinkEvaluator(),
				new ValidTitleEvaluator(20, 50),
			],
		},
	});
	const { scores, avg } = summariseRunResults(results);

	return Response.json({ avg, scores, results });
}
