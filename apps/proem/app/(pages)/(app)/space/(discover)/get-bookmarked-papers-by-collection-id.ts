import { getBookmarkedPapersCacheTag } from "@/app/constants";
import { neonDb } from "@proemial/data";
import {
	Collection,
	collections,
	collectionsToPapers,
} from "@proemial/data/neon/schema";
import { and, eq, isNull } from "drizzle-orm";
import { unstable_cache as cache } from "next/cache";

export async function getBookmarkedPapersByCollectionId(
	collectionId: Collection["id"],
) {
	return cache(
		async () => {
			const collection = await neonDb.query.collections.findFirst({
				columns: { id: true },
				where: and(
					eq(collections.id, collectionId),
					isNull(collections.deletedAt),
				),
				with: {
					collectionsToPapers: {
						where: eq(collectionsToPapers.isEnabled, true),
						columns: {
							paperId: true,
							isEnabled: true,
						},
					},
				},
			});

			return collection?.collectionsToPapers;
		},
		["bookmarks", collectionId],
		{ tags: [getBookmarkedPapersCacheTag(collectionId)] },
	)();
}
