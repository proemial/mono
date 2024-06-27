import { and, asc, eq, inArray, notInArray, or } from "drizzle-orm";
import { neonDb } from "..";
import { Collection, collections } from "../neon/schema";

/**
 * Returns the user's own collections and public collections of org members.
 */
export const findCollectionsByUserIdAndOrgMemberIds = async (
	userId: string,
	orgMemberIds: string[] = [],
) => {
	const orgMemberIdsWithoutCurrentUser = orgMemberIds.filter(
		(id) => id !== userId,
	);

	const allCollections =
		orgMemberIdsWithoutCurrentUser.length > 0
			? await neonDb.query.collections.findMany({
					where: or(
						// The user's own collections
						eq(collections.ownerId, userId),
						and(
							// Org member public collections
							inArray(collections.ownerId, orgMemberIdsWithoutCurrentUser),
							notInArray(collections.id, orgMemberIdsWithoutCurrentUser),
						),
					),
					orderBy: asc(collections.name),
				})
			: await neonDb.query.collections.findMany({
					where: or(eq(collections.ownerId, userId)),
					orderBy: asc(collections.name),
				});

	return [
		...allCollections.filter((c) => c.id === userId),
		...allCollections.filter((c) => c.id !== userId),
	];
};

export const findCollectionsByUserId = async (userId: string) => {
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

export const findCollectionWithPaperIdsBySlug = async (
	id: Collection["id"],
) => {
	return await neonDb.query.collections.findFirst({
		where: eq(collections.id, id),
		with: {
			collectionsToPapers: {
				columns: {
					paperId: true,
				},
			},
		},
	});
};
