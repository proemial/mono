import { answers } from "@/app/api/bot/answer-engine/answers";
import { findRun } from "@/app/llm/helpers/find-run";
import { experimental_StreamData } from "ai";
import { Run } from "langsmith";

type SaveAnswerParams = {
	question: string;
	isFollowUpQuestion: boolean;
	slug: string;
	userId?: string;
	data: experimental_StreamData;
};

export function saveAnswer({
	question,
	isFollowUpQuestion,
	slug,
	userId,
	data,
}: SaveAnswerParams) {
	return async (run: Run) => {
		const answer = findRun(run, (run) => run.name === "AnswerEngine")?.outputs
			?.output;

		if (!answer) {
			data.close();
			throw new Error("Save failure: No answer was found");
		}

		const selectedPapers = findRun(
			run,
			(run) => run.name === "SelectRelevantPapers",
		)?.outputs?.output;

		const searchParamsResponse = findRun(
			run,
			(run) => run.name === "GenerateSearchParams",
		)?.outputs as { keyConcept: string; relatedConcepts: string[] };

		const papers = isFollowUpQuestion
			? {}
			: {
					relatedConcepts: searchParamsResponse.relatedConcepts,
					keyConcept: searchParamsResponse.keyConcept,
					papers: {
						papers: selectedPapers,
					},
			  };

		const insertedAnswer = await answers.create({
			slug,
			question,
			answer,
			ownerId: userId,
			...papers,
		});

		if (!insertedAnswer) {
			data.close();
			return;
		}

		data.append({
			answers: {
				shareId: insertedAnswer.shareId,
				answer: insertedAnswer.answer,
			},
		});
		data.close();
	};
}
