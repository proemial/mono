import { Answer } from "@/app/(pages)/(app)/(ask)/answer/[slug]/answer";
import { mapAnswerToAnswerEngine } from "@/app/(pages)/(app)/(ask)/mapAnswerToAnswerEngine";
import { getBookmarksByUserId } from "@/app/(pages)/(app)/discover/get-bookmarks-by-user-id";
import { answers } from "@/app/api/bot/answer-engine/answers";
import { getInternalUser } from "@/app/hooks/get-internal-user";
import { Main } from "@/components/main";
import { CloseAction } from "@/components/nav-bar/actions/close-action";
import { SimpleHeader } from "@/components/nav-bar/headers/simple-header";
import { NavBarV2 } from "@/components/nav-bar/nav-bar-v2";
import { auth } from "@clerk/nextjs/server";
import { Edit05 } from "@untitled-ui/icons-react";
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
	const { isInternal } = getInternalUser();
	const bookmarks = userId ? await getBookmarksByUserId(userId) : {};

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
			<NavBarV2
				action={
					<CloseAction
						target={"/"}
						iconOverride={<Edit05 className="size-5" />}
					/>
				}
				isInternalUser={isInternal}
			>
				<SimpleHeader title="Ask" />
			</NavBarV2>
			<Main>
				<Answer
					existingData={existingData}
					initialMessages={initialMessages}
					initialSessionSlug={firstAnswer.slug}
					bookmarks={bookmarks}
				/>
			</Main>
		</>
	);
}
