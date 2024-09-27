import { getBookmarkedPapersCacheTag } from "@/app/constants";
import { Collection } from "@proemial/data/neon/schema";
import { getCollectionByCollectionId } from "@proemial/data/repository/collection";
import { unstable_cache as cache } from "next/cache";

export async function getBookmarkedPapersByCollectionId(
	collectionId: Collection["id"],
) {
	return cache(
		async () => {
			console.log("REBUILDING CACHE FOR", collectionId);
			const collection = await getCollectionByCollectionId(collectionId);

			return collection?.collectionsToPapers;
		},
		["bookmarks", collectionId],
		{ tags: [getBookmarkedPapersCacheTag(collectionId)] },
	)();
}
