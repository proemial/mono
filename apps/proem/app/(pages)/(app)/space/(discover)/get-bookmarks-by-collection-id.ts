import { getBookmarkCacheTag } from "@/app/constants";
import { neonDb } from "@proemial/data";
import {
	Collection,
	collections,
	collectionsToPapers,
} from "@proemial/data/neon/schema";
import { and, eq, isNull } from "drizzle-orm";
import { unstable_cache } from "next/cache";

/**
 * @deprecated use {@link getBookmarkedPapersCacheTag} instead
 */
export const getBookmarksByCollectionId = (collectionId: Collection["id"]) =>
	unstable_cache(
		async () => {
			const bookmarks = await neonDb.query.collections.findMany({
				columns: { id: true },
				where: and(
					eq(collections.id, collectionId),
					isNull(collections.deletedAt),
				),
				with: {
					collectionsToPapers: {
						where: eq(collectionsToPapers.isEnabled, true),
					},
				},
			});

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
