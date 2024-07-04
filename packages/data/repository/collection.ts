import { asc, eq } from "drizzle-orm";
import { neonDb } from "..";
import { isPublicSpace } from "../lib/create-id";
import { Collection, collections, collectionsToPapers } from "../neon/schema";

/**
 * Returns the user's own collections and optional org collections (excluding
 * the members' default collection).
 */
export const findCollectionsByOwnerIdAndOrgId = async (
	userId: string,
	orgId: string | undefined,
) => {
	const userCollections = await findCollectionsByOwnerId(userId);
	const orgCollections = orgId ? await findCollectionsByOrgId(orgId) : [];
	const publicOrgCollections = orgCollections
		.filter((c) => isPublicSpace(c.id))
		.filter((c) => c.ownerId !== userId);
	const allCollections = [...userCollections, ...publicOrgCollections].sort(
		(a, b) => a.name.localeCompare(b.name),
	);
	return [
		// Put the user's default collection first
		...allCollections.filter((c) => c.id === userId),
		...allCollections.filter((c) => c.id !== userId),
	];
};

export const findCollectionWithBookmarksById = async (id: Collection["id"]) => {
	return await neonDb.query.collections.findFirst({
		where: eq(collections.id, id),
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

const findCollectionsByOwnerId = async (userId: string) => {
	const userCollections = await neonDb.query.collections.findMany({
		where: eq(collections.ownerId, userId),
		orderBy: asc(collections.name),
	});
	return [
		// Put the user's default collection first
		...userCollections.filter((c) => c.id === userId),
		...userCollections.filter((c) => c.id !== userId),
	];
};

const findCollectionsByOrgId = async (orgId: string) => {
	return await neonDb.query.collections.findMany({
		where: eq(collections.orgId, orgId),
	});
};
