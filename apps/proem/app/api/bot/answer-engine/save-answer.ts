import { answers } from "@/app/api/bot/answer-engine/answers";
import { findRun } from "@/app/llm/helpers/find-run";
import type { Run } from "langsmith";

type SaveAnswerParams = {
	question: string;
	isFollowUpQuestion: boolean;
	slug: string;
	userId?: string;
	run: Run;
};

export async function saveAnswer({
	question,
	isFollowUpQuestion,
	slug,
	userId,
	run,
}: SaveAnswerParams) {
	const answer = findRun(run, (run) => run.name === "AnswerEngine")?.outputs
		?.output;

	const fetchedPapers = findRun(run, (run) => run.name === "FetchPapers")
		?.outputs?.output;

	// TODO: Store `keywords` instead of `keyConcept` and `relatedConcepts`
	const searchParamsResponse = findRun(
		run,
		(run) => run.name === "ExtractSynonymGroups",
	)?.outputs as { keyConcept: string; relatedConcepts: string[] };

	if (answer && fetchedPapers?.length && searchParamsResponse) {
		const papers = isFollowUpQuestion
			? {}
			: {
					relatedConcepts: searchParamsResponse.relatedConcepts,
					keyConcept: searchParamsResponse.keyConcept,
					papers: {
						papers: fetchedPapers,
					},
			  };

		return answers.create({
			slug,
			question,
			answer,
			ownerId: userId,
			...papers,
		});
	}
}

export async function saveAnswerFromAgent({
	question,
	isFollowUpQuestion,
	slug,
	userId,
	run,
}: SaveAnswerParams) {
	const answer = run.outputs?.returnValues?.output;
	const tool = run.inputs?.steps?.find(
		(step: { action: { tool?: string } }) =>
			step.action.tool === "SearchPapers",
	);
	const fetchedPapers = tool?.observation && JSON.parse(tool?.observation);

	if (answer) {
		const persistPapers = !isFollowUpQuestion && fetchedPapers?.length;
		const papers = persistPapers
			? {
					papers: {
						papers: fetchedPapers,
					},
			  }
			: {};

		return answers.create({
			slug,
			question,
			answer,
			ownerId: userId,
			...papers,
		});
	}
}
