import { and, asc, desc, eq, inArray, notInArray, or } from "drizzle-orm";
import { neonDb } from "..";
import { Collection, collections } from "../neon/schema";

/**
 * Returns the user's own collections and public collections of org members.
 */
export const getAvailableCollections = async (
	userId: string,
	orgMemberIds: string[] = [],
) => {
	const orgMemberIdsWithoutCurrentUser = orgMemberIds.filter(
		(id) => id !== userId,
	);
	const allCollections = await neonDb.query.collections.findMany({
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
	});
	return [
		// Put the user's default collection first
		...allCollections.filter((c) => c.id === userId),
		...allCollections.filter((c) => c.id !== userId),
	];
};

export const getCollectionBySlugWithPaperIds = async (
	slug: Collection["slug"],
) => {
	return await neonDb.query.collections.findFirst({
		where: eq(collections.slug, slug),
		with: {
			collectionsToPapers: {
				columns: {
					paperId: true,
				},
			},
		},
	});
};
