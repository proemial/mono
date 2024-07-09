import { getPersonalDefaultCollection } from "@/app/constants";
import { CollectionUtils } from "@/utils/collections";
import { findCollectionWithBookmarksById } from "@proemial/data/repository/collection";

export const CollectionService = {
	getCollection: async (
		collectionId: string,
		userId: string | null | undefined,
		orgId: string | null | undefined,
	) => {
		const collection = await findCollectionWithBookmarksById(collectionId);
		if (collection && CollectionUtils.canRead(collection, userId, orgId)) {
			return collection;
		}
		if (collectionId === userId) {
			return getPersonalDefaultCollection(userId);
		}
		return undefined;
	},
};
