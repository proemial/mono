import { Answer } from "@/app/(pages)/(app)/(ask)/answer/[slug]/answer";
import { mapAnswerToAnswerEngine } from "@/app/(pages)/(app)/(ask)/mapAnswerToAnswerEngine";
import { answers } from "@/app/api/bot/answer-engine/answers";
import { Main } from "@/components/main";
import { GoBackAction } from "@/components/nav-bar/actions/go-back-action";
import { AskHeader } from "@/components/nav-bar/headers/ask-header";
import { NavBarV2 } from "@/components/nav-bar/nav-bar-v2";
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
		<>
			<NavBarV2 action={<GoBackAction />}>
				<AskHeader />
			</NavBarV2>
			<Main>
				<Answer
					existingData={existingData}
					initialMessages={initialMessages}
					initialSessionSlug={firstAnswer.slug}
				/>
			</Main>
		</>
	);
}
