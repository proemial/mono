import { getPersonalDefaultCollection } from "@/app/constants";
import { PermissionUtils } from "@/utils/permission-utils";
import { findCollectionById } from "@proemial/data/repository/collection";

export const CollectionService = {
	getCollection: async (
		collectionId: string,
		userId?: string | null | undefined,
		orgId?: string | null | undefined,
	) => {
		const collection = await findCollectionById(collectionId);
		if (
			collection &&
			PermissionUtils.canReadCollection(collection, userId, orgId)
		) {
			return collection;
		}
		if (collectionId === userId) {
			return getPersonalDefaultCollection(userId);
		}
		return undefined;
	},
};
