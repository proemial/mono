import { neonDb } from "@proemial/data";
import {
	NewCollection,
	collections,
	collectionsToPapers,
} from "@proemial/data/neon/schema";
import { and, eq, isNull } from "drizzle-orm";

export const getPaperIdsForCollection = async (collectionId: string) => {
	const collection = await neonDb.query.collections.findFirst({
		where: and(eq(collections.id, collectionId), isNull(collections.deletedAt)),
		with: {
			collectionsToPapers: {
				where: eq(collectionsToPapers.isEnabled, true),
				columns: {
					paperId: true,
				},
			},
		},
	});

	return collection?.collectionsToPapers.map(({ paperId }) => paperId);
};

export const getNewCollectionTemplate = (
	userId: string,
	orgId: string | null,
) =>
	({
		name: "",
		description: "",
		ownerId: userId,
		orgId,
		shared: orgId ? "organization" : "public",
	}) satisfies NewCollection;
