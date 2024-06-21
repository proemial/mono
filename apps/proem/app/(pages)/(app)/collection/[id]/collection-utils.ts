import { getPersonalDefaultCollection } from "@/app/constants";
import { neonDb } from "@proemial/data";
import { collections } from "@proemial/data/neon/schema";
import { eq } from "drizzle-orm";
import { getBookmarksByUserId } from "../../discover/get-bookmarks-by-user-id";

export const getCollectionPapersAndBookmarks = async (
	userId: string,
	collectionId: string,
) => {
	const collection = (await neonDb.query.collections.findFirst({
		where: eq(collections.slug, collectionId),
		with: {
			collectionsToPapers: {
				columns: {
					paperId: true,
				},
			},
		},
	})) ?? { ...getPersonalDefaultCollection(userId), collectionsToPapers: [] };
	return {
		paperIds: collection.collectionsToPapers.map((c) => c.paperId),
		bookmarks: userId ? await getBookmarksByUserId(userId) : {},
	};
};
