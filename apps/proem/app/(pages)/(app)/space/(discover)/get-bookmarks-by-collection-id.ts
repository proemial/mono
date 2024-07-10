import { getBookmarkCacheTag } from "@/app/constants";
import { Collection } from "@proemial/data/neon/schema";
import { getCollectionsByCollectionId } from "@proemial/data/repository/collection";
import { unstable_cache } from "next/cache";

/**
 * @deprecated use {@link getBookmarkedPapersCacheTag} instead
 */
export const getBookmarksByCollectionId = (collectionId: Collection["id"]) =>
	unstable_cache(
		async () => {
			const bookmarks = await getCollectionsByCollectionId(collectionId);

			return bookmarks.reduce(
				(acc, collection) => {
					for (const paper of collection.collectionsToPapers) {
						if (acc[paper.paperId]) {
							// @ts-expect-error Updating TS should fix this
							acc[paper.paperId].push(collection.id);
						} else {
							acc[paper.paperId] = [collection.id];
						}
					}

					return acc;
				},
				{} as Record<string, string[]>,
			);
		},
		["bookmarks", collectionId],
		{ tags: [getBookmarkCacheTag(collectionId)] },
	)();
