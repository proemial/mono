import { getBookmarkCacheTag } from "@/app/constants";
import { neonDb } from "@proemial/data";
import { Collection, collections } from "@proemial/data/neon/schema";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export const getBookmarksByUserId = (ownerId: Collection["ownerId"]) =>
	unstable_cache(
		async () => {
			const usersBookmarks = await neonDb.query.collections.findMany({
				columns: { id: true },
				where: eq(collections.ownerId, ownerId),
				with: { collectionsToPapers: true },
			});

			return usersBookmarks.reduce(
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
