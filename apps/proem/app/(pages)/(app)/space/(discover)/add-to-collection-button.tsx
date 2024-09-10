"use client";
import {
	addPaperToNewCollection,
	togglePaperInCollection,
} from "@/app/(pages)/(app)/space/(discover)/bookmark-paper";
import { AddButton, AddButtonSkeleton } from "@/components/add-button";
import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import {
	CollectionSelectorProps,
	showCollectionNotification,
	showCollectionSelector,
} from "@/components/show-collection-notification";
import { SignInDrawer } from "@/components/sign-in-drawer";
import { isArxivPaperId } from "@/utils/is-arxiv-paper-id";
import { useUser } from "@clerk/nextjs";
import { useOptimistic } from "react";

export type PaperId = string;
export type CollectionId = string;
export type Bookmarks = Record<PaperId, CollectionId[]>;
export type AddToCollectionButtonProps = Pick<
	CollectionSelectorProps,
	"fromTrackingKey"
> & {
	paperId: PaperId;
	/**
	 * @deprecated use isBookmarked instead
	 */
	bookmarks?: Bookmarks;
	isBookmarked?: boolean;
	customCollectionId?: CollectionId;
	onClick?: (isEnabled: boolean) => void;
};

export function AddToCollectionButton({
	paperId,
	customCollectionId,
	fromTrackingKey,
	onClick,
	isBookmarked = false,
}: AddToCollectionButtonProps) {
	const { user } = useUser();
	const revalidateCache = !onClick;
	const [optimisticBookmark, addOptimisticBookmark] = useOptimistic<
		boolean,
		boolean
	>(isBookmarked, (_, isEnabled) => isEnabled);

	if (!user) {
		return (
			<SignInDrawer
				trigger={
					// extra div to make the trigger a ref
					<div>
						<AddButtonSkeleton />
					</div>
				}
			/>
		);
	}
	const collectionId = customCollectionId ?? user.id;

	if (isArxivPaperId(paperId)) {
		return null;
	}

	return (
		<AddButton
			isChecked={optimisticBookmark}
			onClick={async () => {
				onClick?.(optimisticBookmark);
				const isEnabled = !optimisticBookmark;
				trackHandler(
					isEnabled
						? analyticsKeys.collection.addPaper[fromTrackingKey]
						: analyticsKeys.collection.removePaper[fromTrackingKey],
				)();

				const bookmark = {
					paperId,
					fromTrackingKey,
					bookmarks: [collectionId],
				};

				if (!isEnabled) {
					showCollectionSelector({
						...bookmark,
						onValueToggle: (toggledBookmark) => {
							if (
								toggledBookmark.collectionId === collectionId &&
								toggledBookmark.paperId === paperId
							) {
								addOptimisticBookmark(toggledBookmark.isEnabled);
							}
						},
					});
					return;
				}

				addOptimisticBookmark(isEnabled);

				showCollectionNotification({
					...bookmark,
					newBookmarksCollectionId: collectionId,
				});

				await togglePaperInCollection({
					paperId,
					collectionId,
					isEnabled,
					revalidateCache,
				});
			}}
		/>
	);
}
