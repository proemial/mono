import { runOutputAsString } from "@/app/llm/helpers/evaluator-helpers";
import { Run } from "@langchain/core/tracers/base";
import { EvaluationResult, RunEvaluator } from "langsmith/evaluation";

export class PaperIdEvaluator implements RunEvaluator {
	async evaluateRun(run: Run): Promise<EvaluationResult> {
		console.log(run);
		const papers = mapPapersToIds(run.inputs.papers);
		console.log(papers);
		const output = runOutputAsString(run);
		console.log(output);
		const result = PaperIdEvaluator.evaluate(papers, output);

		return { key: "paper-hallucinated-id", ...result };
	}

	static evaluate<T extends { id: string }>(papers: T[], output: string) {
		const paperIds = output.split(",").map((str) => str.trim()) ?? output;
		const hasHallucinatedId = paperIds.some((id) => {
			return !papers.find((paper) => paper.id === id);
		});

		return { hasHallucinatedId };
	}
}

export function mapPapersToIds<T extends { link: string }>(papers: string) {
	return (JSON.parse(papers) as T[]).map((paper) => ({
		...paper,
		id: paper.link,
	}));
}
