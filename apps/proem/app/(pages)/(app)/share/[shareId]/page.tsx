import { Answer } from "@/app/(pages)/(app)/(ask)/answer/[slug]/answer";
import { mapAnswerToAnswerEngine } from "@/app/(pages)/(app)/(ask)/mapAnswerToAnswerEngine";
import { getBookmarksByUserId } from "@/app/(pages)/(app)/discover/get-bookmarks-by-user-id";
import { answers } from "@/app/api/bot/answer-engine/answers";
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

	if (!sharedAnswer) {
		redirect("/");
	}

	const { existingData, initialMessages } =
		mapAnswerToAnswerEngine(sharedAnswer);

	return (
		<Answer
			existingData={existingData}
			initialMessages={initialMessages}
			bookmarks={bookmarks}
		/>
	);
}
