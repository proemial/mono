import { runOnDataset } from "langchain/smith";
import { answerEngineChain } from "./answer-engine-chain";
import { WordCountEvaluator } from "../evaluators/string-evaluators";
import { summariseRunResults } from "../helpers/summarise-result";
import { LinkCountEvaluator } from "../evaluators/link-evaluators";

describe("answerEngineChain", () => {
	// Works, but vitest breaks
	it("Evaluate `ASK - Reference dataset`", async () => {
		const runResults = await runOnDataset(
			answerEngineChain,
			"ASK - Reference dataset",
			[new WordCountEvaluator(15, 50), new LinkCountEvaluator(2, 2)],
		);

		const { scores, avg } = summariseRunResults(runResults);
		if (avg < 1) {
			console.log("results", avg, scores);
		}

		expect(avg).toBe(1);
	});
});
