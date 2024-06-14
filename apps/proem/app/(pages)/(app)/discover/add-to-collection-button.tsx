import { addPaperToDefaultCollection } from "@/app/(pages)/(app)/discover/bookmark-paper";
import { AddButton } from "@/components/add-button";
import {
	showCollectionNotification,
	showCollectionSelector,
} from "@/components/show-collection-notification";
import { useUser } from "@clerk/nextjs";
import { useOptimistic } from "react";

export type PaperId = string;
export type CollectionId = string;
type Bookmarks = Record<PaperId, CollectionId[]>;
export type AddToCollectionButtonProps = {
	paperId: PaperId;
	bookmarks: Bookmarks;
};

export function AddToCollectionButton({
	paperId,
	bookmarks,
}: AddToCollectionButtonProps) {
	const { user } = useUser();
	const isInternalUser =
		user?.primaryEmailAddress?.emailAddress.endsWith("proemial.ai");
	// TODO! remove
	if (!isInternalUser) {
		return null;
	}
	if (!user) {
		return null;
	}
	const defaultCollectionId = user.id;

	const [optimisticBookmarks, addOptimisticBookmarks] = useOptimistic<
		Bookmarks,
		{ paperId: PaperId }
	>(bookmarks, (state, { paperId }) => ({
		...state,
		[paperId]: [defaultCollectionId],
	}));

	const currentBookmark = optimisticBookmarks[paperId];
	const isBookmarked = Boolean(currentBookmark);

	return (
		<AddButton
			isChecked={isBookmarked}
			onClick={async () => {
				const bookmark = {
					paperId,
					bookmarks: currentBookmark,
				};
				if (isBookmarked) {
					showCollectionSelector(bookmark);
					return;
				}

				addOptimisticBookmarks({ paperId });
				const optimisticBookmarksWithExtraOptimism = {
					...optimisticBookmarks,
					[paperId]: [defaultCollectionId],
				}[paperId];
				showCollectionNotification({
					...bookmark,
					bookmarks: optimisticBookmarksWithExtraOptimism,
				});
				await addPaperToDefaultCollection({ paperId });
			}}
		/>
	);
}
