"use server";

import {
	PERSONAL_DEFAULT_COLLECTION_NAME,
	getBookmarkCacheTag,
} from "@/app/constants";
import { auth } from "@clerk/nextjs";
import { neonDb } from "@proemial/data";
import {
	collections,
	collectionsToPapers,
	papers,
} from "@proemial/data/neon/schema";
import { and, eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { z } from "zod";

const addPaperToDefaultCollectionParams = z.object({
	paperId: z.string(),
});

/**
 * addPapeToDefaultCollection adds a paper to the user's default collection.
 * Create the default collection for the given user if it doesn't exist.
 */
export async function addPaperToDefaultCollection(
	params: z.infer<typeof addPaperToDefaultCollectionParams>,
) {
	const { userId } = auth();
	const { paperId } = addPaperToDefaultCollectionParams.parse(params);
	if (!userId) {
		return;
	}

	await Promise.all([
		neonDb
			.insert(collections)
			.values({
				id: userId,
				ownerId: userId,
				name: PERSONAL_DEFAULT_COLLECTION_NAME,
				slug: userId,
			})
			.returning()
			.onConflictDoNothing(),
		neonDb.insert(papers).values({ id: paperId }).onConflictDoNothing(),
	]);

	await neonDb
		.insert(collectionsToPapers)
		.values({ collectionsId: userId, paperId })
		.onConflictDoNothing();

	revalidateTag(getBookmarkCacheTag(userId));
	return {};
}

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
	return {};
}
