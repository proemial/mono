import { neonDb } from "@proemial/data";
import {
	Collection,
	collections,
	collectionsToPapers,
} from "@proemial/data/neon/schema";
import { eq } from "drizzle-orm";

export async function getBookmarkedPapersByCollectionId(
	collectionId: Collection["id"],
) {
	const collection = await neonDb.query.collections.findFirst({
		columns: { id: true },
		where: eq(collections.id, collectionId),
		with: {
			collectionsToPapers: {
				where: eq(collectionsToPapers.isEnabled, true),
				columns: {
					paperId: true,
					isEnabled: true,
				},
			},
		},
	});

	return collection?.collectionsToPapers;
}
