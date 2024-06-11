"use server";

import {
	PERSONAL_DEFAULT_COLLECTION_NAME,
	getBookmarkCacheTag,
} from "@/app/constants";
import { auth } from "@clerk/nextjs";
import { neonDb } from "@proemial/data";
import {
	bookmarks,
	collectionRelations,
	collections,
	collectionsToPapers,
	papers,
	users,
} from "@proemial/data/neon/schema";
import { and, eq } from "drizzle-orm";
import { revalidateTag, unstable_cache } from "next/cache";
import { z } from "zod";

const bookmarkPaperParams = z.object({
	userId: z.string().optional(),
	paperId: z.string(),
});

// TODO: Auth and rate limit

export async function hasPaperBookmark(params: unknown) {
	const { userId, paperId } = bookmarkPaperParams.parse(params);
	if (!userId) {
		return false;
	}
	const bookmark = await neonDb.query.bookmarks.findFirst({
		where: and(eq(bookmarks.paperId, paperId), eq(bookmarks.userId, userId)),
	});
	return !!bookmark;
}

export async function addPaperBookmark(params: unknown) {
	const { userId, paperId } = bookmarkPaperParams.parse(params);
	if (!userId) {
		return;
	}
	await Promise.all([
		neonDb.insert(users).values({ id: userId }).onConflictDoNothing(),
		neonDb.insert(papers).values({ id: paperId }).onConflictDoNothing(),
	]);
	await neonDb
		.insert(bookmarks)
		.values({ userId, paperId })
		.onConflictDoNothing();
}

export async function removePaperBookmark(params: unknown) {
	const { userId, paperId } = bookmarkPaperParams.parse(params);
	if (!userId) {
		return;
	}
	await neonDb
		.delete(bookmarks)
		.where(and(eq(bookmarks.paperId, paperId), eq(bookmarks.userId, userId)));
}

const addPapeToDefaultCollectionParams = z.object({
	paperId: z.string(),
});

/**
 * addPapeToDefaultCollection adds a paper to the user's default collection.
 * Create the default collection for the given user if it doesn't exist.
 */
export async function addPapeToDefaultCollection(
	params: z.infer<typeof addPapeToDefaultCollectionParams>,
) {
	const { userId } = auth();
	const { paperId } = addPapeToDefaultCollectionParams.parse(params);
	if (!userId) {
		return;
	}

	// TODO! Turn it around so insert bookmark first and default to create collection afterwards
	const test = await Promise.all([
		neonDb
			.insert(collections)
			.values({
				ownerId: userId,
				name: PERSONAL_DEFAULT_COLLECTION_NAME,
				slug: userId,
			})
			.returning()
			.onConflictDoNothing(),
		neonDb.insert(papers).values({ id: paperId }).onConflictDoNothing(),
	]);

	console.log(test);
	const collectionsId = 12;

	// TODO:! Use Slug instead of ID
	await neonDb
		.insert(collectionsToPapers)
		.values({ collectionsId, paperId })
		.onConflictDoNothing();

	revalidateTag(getBookmarkCacheTag(userId));
	return {};
}

const togglePaperInCollectionParams = z.object({
	paperId: z.string(),
	collectionId: z.number(),
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
