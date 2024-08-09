import { Answer } from "@/app/(pages)/(app)/ask/answer/[slug]/answer";
import { mapAnswerToAnswerEngine } from "@/app/(pages)/(app)/ask/mapAnswerToAnswerEngine";
import { getBookmarksByCollectionId } from "@/app/(pages)/(app)/space/(discover)/get-bookmarks-by-collection-id";
import { Main } from "@/components/main";
import { routes } from "@/routes";
import { auth } from "@clerk/nextjs/server";
import { answers } from "@proemial/data/repository/answer";
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
		<Main>
			<Answer
				existingData={existingData}
				initialMessages={initialMessages}
				initialSessionSlug={firstAnswer.slug}
				bookmarks={bookmarks}
			/>
		</Main>
	);
}
