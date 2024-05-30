import { Answer } from "@/app/(pages)/(app)/(ask)/answer/[slug]/answer";
import { mapAnswerToAnswerEngine } from "@/app/(pages)/(app)/(ask)/mapAnswerToAnswerEngine";
import { answers } from "@/app/api/bot/answer-engine/answers";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

type Props = {
	params: {
		slug: string;
	};
};

export default async function AnswerPage({ params: { slug } }: Props) {
	const allAnswers = await answers.getBySlug(slug);
	const { userId } = auth();
	const [firstAnswer] = allAnswers;

	if (!firstAnswer) {
		redirect("/");
	}
	const answerIsByCurrentUser = firstAnswer.ownerId === userId;

	const { existingData, initialMessages } = mapAnswerToAnswerEngine(
		allAnswers,
		answerIsByCurrentUser,
	);

	return (
		<Answer
			existingData={existingData}
			initialMessages={initialMessages}
			initialSessionSlug={firstAnswer.slug}
		/>
	);
}
