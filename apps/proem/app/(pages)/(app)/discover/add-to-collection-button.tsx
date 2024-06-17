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
	customCollectionId?: CollectionId;
};

export function AddToCollectionButton({
	paperId,
	bookmarks,
	customCollectionId,
}: AddToCollectionButtonProps) {
	const { user } = useUser();
	if (!user) {
		return null;
	}
	const collectionId = customCollectionId ?? user.id;

	const [optimisticBookmarks, addOptimisticBookmarks] = useOptimistic<
		Bookmarks,
		{ paperId: PaperId }
	>(bookmarks, (state, { paperId }) => ({
		...state,
		[paperId]: [collectionId],
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
				const newBookmarksCollectionId = collectionId;
				const optimisticBookmarksWithExtraOptimism = {
					...optimisticBookmarks,
					[paperId]: [newBookmarksCollectionId],
				}[paperId];

				showCollectionNotification({
					...bookmark,
					newBookmarksCollectionId,
					bookmarks: optimisticBookmarksWithExtraOptimism,
				});
				await addPaperToDefaultCollection({ paperId });
			}}
		/>
	);
}
