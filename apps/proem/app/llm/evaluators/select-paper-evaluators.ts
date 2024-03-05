import { getOutputFromRun } from "@/app/llm/helpers/evaluator-helpers";
import { Run } from "langsmith";
import { EvaluationResult, RunEvaluator } from "langsmith/evaluation";

type Output = string[];

export class PaperIdEvaluator implements RunEvaluator {
	async evaluateRun(run: Run): Promise<EvaluationResult> {
		const papers = mapPapersToIds(run.inputs.papers);
		const output = getOutputFromRun<Output>(run);
		const result = PaperIdEvaluator.evaluate(papers, output);

		return { key: "paper-hallucinated-id", ...result };
	}

	static evaluate<T extends { id: string }>(papers: T[], output?: Output) {
		if (!output) {
			return { value: 0, score: 0, comment: "No answer was found" };
		}

		const paperIds = output;
		const { hallucinatedIds } = validatePaperIds(papers, paperIds);
		const hallucinatedIdsCount = hallucinatedIds.length;

		return {
			value: hallucinatedIdsCount,
			score: 1 - hallucinatedIdsCount / paperIds.length,
			comment:
				hallucinatedIdsCount > 0
					? `Expected no hallucinated ids, but found ${hallucinatedIdsCount} in the output`
					: "No hallucinated ids found in the output",
		};
	}
}

export function mapPapersToIds<T extends { link: string }>(papers: string) {
	return (JSON.parse(papers) as T[]).map((paper) => ({
		...paper,
		id: paper.link.replace("/oa/", ""),
	}));
}

function validatePaperIds(papers: { id: string }[], paperIds: string[]) {
	return paperIds.reduce<{
		validIds: string[];
		hallucinatedIds: string[];
	}>(
		(acc, cur) => {
			if (papers.find((paper) => paper.id === cur)) {
				acc.validIds.push(cur);
			} else {
				acc.hallucinatedIds.push(cur);
			}

			return acc;
		},
		{ validIds: [], hallucinatedIds: [] },
	);
}
