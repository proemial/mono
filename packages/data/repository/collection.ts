import { and, eq, inArray, notInArray, or } from "drizzle-orm";
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
	return await neonDb.query.collections.findMany({
		where: or(
			// The user's own collections
			eq(collections.ownerId, userId),
			and(
				// Org member public collections
				inArray(collections.ownerId, orgMemberIdsWithoutCurrentUser),
				notInArray(collections.id, orgMemberIdsWithoutCurrentUser),
			),
		),
	});
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
