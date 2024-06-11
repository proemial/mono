import { addPapeToDefaultCollection } from "@/app/(pages)/(app)/discover/bookmark-paper";
import { useUser } from "@/app/hooks/use-user";
import { AddButton } from "@/components/add-button";
import { showCollectionSelector } from "@/components/show-collection-notification";
import { useOptimistic } from "react";

type PaperId = string;
type OrganisationSlug = number;
type Bookmarks = Record<PaperId, OrganisationSlug[]>;
export type AddToCollectionButtonProps = {
	paperId: PaperId;
	bookmarks: Bookmarks;
};

export function AddToCollectionButton({
	paperId,
	bookmarks,
}: AddToCollectionButtonProps) {
	const { user } = useUser();
	if (!user) {
		return null;
	}

	const [optimisticBookmarks, addOptimisticBookmarks] = useOptimistic<
		Bookmarks,
		{ paperId: PaperId }
	>(bookmarks, (state, { paperId }) => ({ ...state, [paperId]: [11] }));

	const currentBookmark = optimisticBookmarks[paperId];

	const isBookmarked = Boolean(currentBookmark);

	return (
		<AddButton
			isChecked={isBookmarked}
			onClick={async () => {
				// TODO! Push for user onboarding flow if not logged in
				if (isBookmarked) {
					return showCollectionSelector({
						paperId,
						bookmarks: currentBookmark,
					});
				}

				addOptimisticBookmarks({ paperId });
				await addPapeToDefaultCollection({ paperId });
			}}
		/>
	);
}
