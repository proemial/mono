import { addPapeToDefaultCollection } from "@/app/(pages)/(app)/discover/bookmark-paper";
import { AddButton } from "@/components/add-button";
import {
	showCollectionNotification,
	showCollectionSelector,
} from "@/components/show-collection-notification";
import { Button } from "@proemial/shadcn-ui";
import { useOptimistic } from "react";
import { useFormState, useFormStatus } from "react-dom";

type PaperId = string;
type OrganisationSlug = number;
export type AddToCollectionButtonProps = {
	paperId: PaperId;
	bookmarks: Record<PaperId, OrganisationSlug[]>;
};

export function AddToCollectionButton({
	paperId,
	bookmarks,
}: AddToCollectionButtonProps) {
	console.log(bookmarks);
	const currentBookmark = bookmarks[paperId];
	const isBookmarked = Boolean(currentBookmark);
	console.log(currentBookmark)
	console.log(isBookmarked);
	// 	const [optimisticMessages, addOptimisticMessage] = useOptimistic<
	// 	Message[],
	// 	string
	// >(messages, (state, newMessage) => [...state, { message: newMessage }])

	// const { pending, state } = useFormState();

	return (
		<>
			<Button onClick={() => showCollectionNotification(paperId)}>1</Button>
			<Button onClick={() => showCollectionSelector(paperId, currentBookmark)}>
				2
			</Button>
			<AddButton
				isChecked={isBookmarked}
				onClick={async () => {
					if (isBookmarked) {
						return showCollectionSelector(paperId, currentBookmark);
					}

					// TODO! Push for user onboarding flow
					console.log("clicked");
					const newValue = "true";
					// addOptimisticMessage(newValue)
					showCollectionNotification(paperId);
					await addPapeToDefaultCollection({ paperId });
					// showCollectionNotification();
				}}
			/>
		</>
	);
}
