import { Answer } from "@/app/(pages)/(app)/(ask)/answer/[id]/answer";
import { SHARED_ANSWER_TRANSACTION_ID } from "@/app/(pages)/(app)/share/constants";
import { answers } from "@/app/api/bot/answer-engine/answers";
import { redirect } from "next/navigation";

export const revalidate = 1;
export const metadata = {
	title: "proem - science answers",
};

type Props = {
	params: { shareId: string };
};

export default async function SharePage({ params: { shareId } }: Props) {
	const [sharedAnswer] = await answers.getByShareId(shareId);

	if (!sharedAnswer) {
		redirect("/");
	}
	const existingData = [];
	const existingPapers = sharedAnswer.papers;
	const existingShareId = sharedAnswer.shareId;
	const existingFollowUpQuestions = sharedAnswer.followUpQuestions;

	if (existingPapers) {
		existingData.push({
			type: "papers-fetched" as const,
			transactionId: SHARED_ANSWER_TRANSACTION_ID,
			data: existingPapers,
		});
	}

	if (existingShareId) {
		existingData.push({
			type: "answer-saved" as const,
			transactionId: SHARED_ANSWER_TRANSACTION_ID,
			data: {
				shareId: existingShareId,
				runId: existingShareId,
			},
		});
	}

	if (existingFollowUpQuestions) {
		existingData.push({
			type: "follow-up-questions-generated" as const,
			transactionId: SHARED_ANSWER_TRANSACTION_ID,
			data: existingFollowUpQuestions as { question: string }[],
		});
	}

	return (
		<Answer
			existingData={existingData}
			initialMessages={[
				{
					id: SHARED_ANSWER_TRANSACTION_ID,
					role: "user",
					content: sharedAnswer.question,
				},
				{
					id: `${SHARED_ANSWER_TRANSACTION_ID}_response`,
					role: "assistant",
					content: sharedAnswer.answer,
				},
			]}
		/>
	);
}
