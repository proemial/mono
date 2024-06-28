import { getBookmarkCacheTag } from "@/app/constants";
import { neonDb } from "@proemial/data";
import { Collection, collections } from "@proemial/data/neon/schema";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export const getBookmarksByCollectionId = (ownerId: Collection["id"]) =>
	unstable_cache(
		async () => {
			const bookmarks = await neonDb.query.collections.findMany({
				columns: { id: true },
				where: eq(collections.id, ownerId),
				with: { collectionsToPapers: true },
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
		["bookmarks", ownerId],
		{ tags: [getBookmarkCacheTag(ownerId)] },
	)();
