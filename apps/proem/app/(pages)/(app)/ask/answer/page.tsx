import { Answer } from "@/app/(pages)/(app)/ask/answer/[slug]/answer";
import { getBookmarksByCollectionId } from "@/app/(pages)/(app)/space/(discover)/get-bookmarks-by-collection-id";
import { Main } from "@/components/main";
import { routes } from "@/routes";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

type Props = {
	searchParams: {
		q?: string;
	};
};

export default async function AnswerPage({ searchParams }: Props) {
	const initialQuestion = searchParams.q;
	const { userId } = auth();
	const bookmarks = userId ? await getBookmarksByCollectionId(userId) : {};
	if (!initialQuestion) {
		redirect(routes.ask);
	}

	return (
		<Main>
			<Answer initialQuestion={initialQuestion} bookmarks={bookmarks} />
		</Main>
	);
}
