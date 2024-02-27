import { runOnDataset } from "langchain/smith";
import { answerEngineChain } from "./answer-engine-chain";
import { CharCountEvaluator } from "../evaluators/string-evaluators";
import { summariseRunResults } from "../helpers/summarise-result";
import {
	LinkCountEvaluator,
	ValidLinkEvaluator,
	ValidTitleEvaluator,
	LinksEvaluator,
} from "../evaluators/link-evaluators";

describe("answerEngineChain", () => {
	// Works, but vitest breaks
	it("Evaluate `ASK - Reference dataset`", async () => {
		const runResults = await runOnDataset(
			answerEngineChain,
			"ASK - Reference dataset",
			{
				evaluators: [
					new CharCountEvaluator(200, 400),
					new LinksEvaluator(1, 2),
					new LinkCountEvaluator(1, 2),
					new ValidLinkEvaluator(),
					new ValidTitleEvaluator(20, 50),
				],
			},
		);

		const { scores, avg } = summariseRunResults(runResults);
		if (avg < 1) {
			console.log("results", avg, scores);
		}

		expect(avg).toBe(1);
	});
});
