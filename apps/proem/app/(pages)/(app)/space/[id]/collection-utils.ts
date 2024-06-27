import { neonDb } from "@proemial/data";
import { collections } from "@proemial/data/neon/schema";
import { eq } from "drizzle-orm";

export const getPaperIdsForCollection = async (collectionId: string) => {
	const collection = await neonDb.query.collections.findFirst({
		where: eq(collections.id, collectionId),
		with: {
			collectionsToPapers: {
				columns: {
					paperId: true,
				},
			},
		},
	});

	return collection?.collectionsToPapers.map(({ paperId }) => paperId);
};
