import { getBookmarkCacheTag } from "@/app/constants";
import { neonDb } from "@proemial/data";
import { collections } from "@proemial/data/neon/schema";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export const getBookmarksByUserId = (userId: string) =>
	unstable_cache(
		async () => {
			const usersBookmarks = await neonDb.query.collections.findMany({
				// where: { ownerId: "user_2Zrcp6UuNROrHQ7jo32HduhYDsJ" },
				columns: { id: true },
				where: eq(collections.ownerId, userId),
				with: { collectionsToPapers: true },
			});

			return usersBookmarks.reduce(
				(acc, collection) => {
					for (const paper of collection.collectionsToPapers) {
						if (acc[paper.paperId]) {
							// @ts-expect-error
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
		["bookmarks", userId],
		{ tags: [getBookmarkCacheTag(userId)] },
	)();
