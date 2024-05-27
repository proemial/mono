import { SHARED_ANSWER_TRANSACTION_ID } from "@/app/(pages)/(app)/share/constants";
import { AnswerEngineEvents } from "@/app/api/bot/answer-engine/events";
import { Answer } from "@proemial/data/neon/schema/answersTable";
import { Message } from "ai/dist";

export const mapAnswerToAnswerEngine = (
	answer: Answer,
	isByCurrentUser = false,
): { existingData: AnswerEngineEvents[]; initialMessages: Message[] } => {
	const transactionId = isByCurrentUser
		? answer.slug
		: SHARED_ANSWER_TRANSACTION_ID;
	const existingData = [];
	const existingPapers = answer.papers;
	const existingShareId = answer.shareId;
	const existingFollowUpQuestions = answer.followUpQuestions;

	if (existingPapers) {
		existingData.push({
			type: "papers-fetched" as const,
			transactionId,
			data: existingPapers,
		});
	}

	if (existingShareId) {
		existingData.push({
			type: "answer-saved" as const,
			transactionId,
			data: {
				shareId: existingShareId,
				runId: existingShareId,
			},
		});
	}

	if (existingFollowUpQuestions) {
		existingData.push({
			type: "follow-up-questions-generated" as const,
			transactionId,
			data: existingFollowUpQuestions as { question: string }[],
		});
	}
	return {
		existingData: existingData,
		initialMessages: [
			{
				id: transactionId,
				role: "user",
				content: answer.question,
			},
			{
				id: `${transactionId}_response`,
				role: "assistant",
				content: answer.answer,
			},
		],
	};
};
