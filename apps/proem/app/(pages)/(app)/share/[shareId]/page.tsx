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
	const existingPapers = sharedAnswer.papers;

	return (
		<Answer
			{...(existingPapers
				? {
						existingData: [
							{
								type: "papers-fetched",
								transactionId: "initial_message_question",
								data: existingPapers,
							},
							{
								type: "follow-up-questions-generated",
								transactionId: "initial_message_question",
								data: [
									{ question: "hardcoded 1" },
									{ question: "hardcoded 2" },
								],
							},
						],
					}
				: {})}
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
