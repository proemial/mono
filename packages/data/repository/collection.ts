import { and, asc, eq, inArray, isNull, ne, or } from "drizzle-orm";
import { neonDb } from "..";
import { Collection, collections, collectionsToPapers } from "../neon/schema";

export const findAvailableCollections = async (
	userId: string,
	orgId: string | undefined,
) => {
	const results = await neonDb.query.collections.findMany({
		where: or(
			// User's own spaces
			and(eq(collections.ownerId, userId), isNull(collections.deletedAt)),
			and(
				// Org members' "org" and "public" spaces
				ne(collections.ownerId, userId),
				eq(collections.orgId, orgId ?? ""),
				inArray(collections.shared, ["organization", "public"]),
				isNull(collections.deletedAt),
			),
		),
		orderBy: asc(collections.name),
	});
	return [
		// Put the user's default space first
		...results.filter((c) => c.id === userId),
		...results.filter((c) => c.id !== userId),
	];
};

export const findCollectionWithBookmarksById = async (id: Collection["id"]) => {
	return await neonDb.query.collections.findFirst({
		where: and(eq(collections.id, id), isNull(collections.deletedAt)),
		with: {
			collectionsToPapers: {
				where: eq(collectionsToPapers.isEnabled, true),
				columns: {
					paperId: true,
				},
			},
		},
	});
};

export const findCollectionsByOwnerId = async (userId: string) => {
	const userCollections = await neonDb.query.collections.findMany({
		where: and(eq(collections.ownerId, userId), isNull(collections.deletedAt)),
		orderBy: asc(collections.name),
	});
	return [
		// Put the user's default collection first
		...userCollections.filter((c) => c.id === userId),
		...userCollections.filter((c) => c.id !== userId),
	];
};
