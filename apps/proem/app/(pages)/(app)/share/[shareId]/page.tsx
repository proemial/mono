import { Answer } from "@/app/(pages)/(app)/ask/answer/[slug]/answer";
import { mapAnswerToAnswerEngine } from "@/app/(pages)/(app)/ask/mapAnswerToAnswerEngine";
import { getBookmarksByCollectionId } from "@/app/(pages)/(app)/space/(discover)/get-bookmarks-by-collection-id";
import { Main } from "@/components/main";
import { routes } from "@/routes";
import { auth } from "@clerk/nextjs";
import { answers } from "@proemial/data/repository/answer";
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
	const { userId } = auth();
	const bookmarks = userId ? await getBookmarksByCollectionId(userId) : {};

	if (!sharedAnswer) {
		redirect(routes.space);
	}

	const { existingData, initialMessages } =
		mapAnswerToAnswerEngine(sharedAnswer);

	return (
		<Main>
			<Answer
				existingData={existingData}
				initialMessages={initialMessages}
				bookmarks={bookmarks}
			/>
		</Main>
	);
}
