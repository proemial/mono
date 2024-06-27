import { Answer } from "@/app/(pages)/(app)/ask/answer/[slug]/answer";
import { mapAnswerToAnswerEngine } from "@/app/(pages)/(app)/ask/mapAnswerToAnswerEngine";
import { getBookmarksByUserId } from "@/app/(pages)/(app)/space/(discover)/get-bookmarks-by-user-id";
import { answers } from "@/app/api/bot/answer-engine/answers";
import { getInternalUser } from "@/app/hooks/get-internal-user";
import { Main } from "@/components/main";
import { CloseAction } from "@/components/nav-bar/actions/close-action";
import { SimpleHeader } from "@/components/nav-bar/headers/simple-header";
import { NavBarV2 } from "@/components/nav-bar/nav-bar-v2";
import { routes } from "@/routes";
import { auth } from "@clerk/nextjs";
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
	const bookmarks = userId ? await getBookmarksByUserId(userId) : {};
	const { isInternal } = getInternalUser();

	if (!sharedAnswer) {
		redirect(routes.space);
	}

	const { existingData, initialMessages } =
		mapAnswerToAnswerEngine(sharedAnswer);

	return (
		<>
			<NavBarV2
				action={<CloseAction target={routes.space} />}
				isInternalUser={isInternal}
			>
				<SimpleHeader title="Ask" />
			</NavBarV2>
			<Main>
				<Answer
					existingData={existingData}
					initialMessages={initialMessages}
					bookmarks={bookmarks}
				/>
			</Main>
		</>
	);
}
