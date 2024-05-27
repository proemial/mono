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
	const [answer] = await answers.getBySlug(slug);
	const { userId } = auth();

	if (!answer) {
		redirect("/");
	}
	const answerIsByCurrentUser = answer.ownerId === userId;
	console.log(answerIsByCurrentUser);

	const { existingData, initialMessages } = mapAnswerToAnswerEngine(
		answer,
		answerIsByCurrentUser,
	);

	return (
		<Answer existingData={existingData} initialMessages={initialMessages} />
	);
}
