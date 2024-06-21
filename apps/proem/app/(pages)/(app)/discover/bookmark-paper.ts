"use server";

import {
	PERSONAL_DEFAULT_COLLECTION_NAME,
	getBookmarkCacheTag,
} from "@/app/constants";
import { streamCacheUpdate } from "@/inngest/populator.task";
import { auth } from "@clerk/nextjs";
import { neonDb } from "@proemial/data";
import {
	NewCollection,
	collections,
	collectionsToPapers,
	papers,
} from "@proemial/data/neon/schema";
import { and, eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { revalidateTag } from "next/cache";
import { z } from "zod";

const addPaperToCollectionParams = z.object({
	paperId: z.string(),
	collection: createInsertSchema(collections).optional(),
});

/**
 * Adds a given paper to a collection. If a collection is not specified, the
 * paper will be added to the user's default collection.
 *
 * In any case, this will create a collection if it doesn't exist.
 */
export async function addPaperToCollection(
	params: z.infer<typeof addPaperToCollectionParams>,
) {
	const { userId } = auth();
	const { paperId, collection } = addPaperToCollectionParams.parse(params);

	if (!userId) {
		return;
	}

	const results = await Promise.all([
		// Ensure paper exists in db
		neonDb
			.insert(papers)
			.values({ id: paperId })
			.onConflictDoNothing(),
		// Ensure collection exists in db
		...[
			collection
				? ensureCollectionExists(collection)
				: ensureDefaultCollectionExists(userId),
		],
	]);

	const newCollectionId = results[1]?.[0]?.id;
	if (collection && !newCollectionId) {
		throw new Error("Failed to create collection");
	}

	await neonDb
		.insert(collectionsToPapers)
		.values({
			collectionsId: collection && newCollectionId ? newCollectionId : userId,
			paperId,
		})
		.onConflictDoNothing();

	revalidateTag(getBookmarkCacheTag(userId));
	void streamCacheUpdate.run(userId);
	return {};
}

const ensureDefaultCollectionExists = (userId: string) =>
	ensureCollectionExists({
		id: userId,
		ownerId: userId,
		name: PERSONAL_DEFAULT_COLLECTION_NAME,
		slug: userId,
		description:
			"This is your private collection. Papers you save will be stored here, unless you specify another collection.",
	});

const ensureCollectionExists = (collection: NewCollection) =>
	neonDb
		.insert(collections)
		.values(collection)
		.returning()
		.onConflictDoNothing();

const togglePaperInCollectionParams = z.object({
	paperId: z.string(),
	collectionId: z.string(),
	isEnabled: z.boolean(),
});

export async function togglePaperInCollection(
	params: z.infer<typeof togglePaperInCollectionParams>,
) {
	const { userId } = auth();
	const { paperId, collectionId, isEnabled } =
		togglePaperInCollectionParams.parse(params);

	if (!userId) {
		return;
	}

	if (isEnabled) {
		await neonDb
			.insert(collectionsToPapers)
			.values({ collectionsId: collectionId, paperId })
			.onConflictDoNothing();
	} else {
		await neonDb
			.delete(collectionsToPapers)
			.where(
				and(
					eq(collectionsToPapers.paperId, paperId),
					eq(collectionsToPapers.collectionsId, collectionId),
				),
			);
	}

	revalidateTag(getBookmarkCacheTag(userId));
	void streamCacheUpdate.run(userId);
	return {};
}
