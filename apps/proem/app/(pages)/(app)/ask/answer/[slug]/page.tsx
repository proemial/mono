import { Answer } from "@/app/(pages)/(app)/ask/answer/[slug]/answer";
import { mapAnswerToAnswerEngine } from "@/app/(pages)/(app)/ask/mapAnswerToAnswerEngine";
import { getBookmarksByCollectionId } from "@/app/(pages)/(app)/space/(discover)/get-bookmarks-by-collection-id";
import { answers } from "@/app/api/bot/answer-engine/answers";
import { Main } from "@/components/main";
import { CloseAction } from "@/components/nav-bar/actions/close-action";
import { SimpleHeader } from "@/components/nav-bar/headers/simple-header";
import { NavBar } from "@/components/nav-bar/nav-bar";
import { routes } from "@/routes";
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
	const bookmarks = userId ? await getBookmarksByCollectionId(userId) : {};

	if (!firstAnswer) {
		redirect(routes.ask);
	}
	const answerIsByCurrentUser = firstAnswer.ownerId === userId;

	const { existingData, initialMessages } = mapAnswerToAnswerEngine(
		allAnswers,
		answerIsByCurrentUser,
	);

	return (
		<>
			<NavBar
				action={
					<CloseAction
						target={routes.ask}
						iconOverride={<Edit05 className="size-5" />}
					/>
				}
			>
				<SimpleHeader title="Ask" />
			</NavBar>
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
