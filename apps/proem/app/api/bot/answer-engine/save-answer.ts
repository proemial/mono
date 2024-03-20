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

	const searchParamsResponse = findRun(
		run,
		(run) => run.name === "GenerateSearchParams",
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
