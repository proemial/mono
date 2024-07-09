import { Collection } from "@proemial/data/neon/schema";

export const PermissionUtils = {
	canReadCollection: (
		collection: Collection,
		userId: string | null | undefined,
		orgId: string | null | undefined,
	) => {
		// Allow reads by anyone, if the space is shared with the public
		if (collection.shared === "public") return true;
		// Allow reads by org members, if the space is shared with the org
		if (collection.orgId === orgId && collection.shared === "organization")
			return true;
		// Allow reads by owner
		if (collection.ownerId === userId) return true;
		return false;
	},

	canEditCollection: (
		collection: Collection,
		userId: string | null | undefined,
		orgId: string | null | undefined,
	) => {
		// Allow edits by owner
		if (collection.ownerId === userId) return true;
		// Allow edits by org members, if the space is shared with the org or public
		if (
			collection.orgId === orgId &&
			["organization", "public"].includes(collection.shared)
		)
			return true;
		return false;
	},
};
