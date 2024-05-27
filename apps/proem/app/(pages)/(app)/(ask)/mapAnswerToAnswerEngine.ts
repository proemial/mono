import { SHARED_ANSWER_TRANSACTION_ID } from "@/app/(pages)/(app)/share/constants";
import { AnswerEngineEvents } from "@/app/api/bot/answer-engine/events";
import { Answer } from "@proemial/data/neon/schema/answersTable";
import { Message } from "ai/dist";

export const mapAnswerToAnswerEngine = (
	answer: Answer | Answer[],
	isByCurrentUser = false,
): { existingData: AnswerEngineEvents[]; initialMessages: Message[] } => {
	const answerArray = Array.isArray(answer) ? answer : [answer];

	return answerArray.reduce(
		(acc, answer) => {
			const transactionId = isByCurrentUser
				? answer.id.toString()
				: SHARED_ANSWER_TRANSACTION_ID;
			const existingPapers = answer.papers;
			const existingShareId = answer.shareId;
			const existingFollowUpQuestions = answer.followUpQuestions;

			if (existingPapers) {
				acc.existingData.push({
					type: "papers-fetched" as const,
					transactionId,
					data: existingPapers,
				});
			}

			if (existingShareId) {
				acc.existingData.push({
					type: "answer-saved" as const,
					transactionId,
					data: {
						shareId: existingShareId,
						runId: existingShareId,
					},
				});
			}

			if (existingFollowUpQuestions) {
				acc.existingData.push({
					type: "follow-up-questions-generated" as const,
					transactionId,
					data: existingFollowUpQuestions as { question: string }[],
				});
			}

			acc.initialMessages.push({
				id: transactionId,
				role: "user",
				content: answer.question,
			});

			acc.initialMessages.push({
				id: `${transactionId}_response`,
				role: "assistant",
				content: answer.answer,
			});

			return acc;
		},
		{
			existingData: [],
			initialMessages: [],
		} as { existingData: AnswerEngineEvents[]; initialMessages: Message[] },
	);
};
