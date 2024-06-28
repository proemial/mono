"use server";

import {
	getBookmarkCacheTag,
	getPersonalDefaultCollection,
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
import { waitUntil } from "@vercel/functions";
import { and, eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { fetchPaper } from "../../paper/oa/[id]/fetch-paper";
import { generate } from "../../paper/oa/[id]/llm-generate";

const addPaperToExistingCollectionParaps = z.object({
	paperId: z.string(),
	collectionId: z.string(),
});

export async function addPaperToExistingCollection(
	params: z.infer<typeof addPaperToExistingCollectionParaps>,
) {
	const { userId } = auth();
	const { paperId, collectionId } =
		addPaperToExistingCollectionParaps.parse(params);
	if (!userId) {
		return;
	}
	await ensurePaperIsSummarized(paperId);
	await ensurePaperExistsInDb(paperId);
	if (collectionId === userId) {
		await ensureDefaultCollectionExistsInDb(userId);
	}
	await neonDb
		.insert(collectionsToPapers)
		.values({ collectionsId: collectionId, paperId });

	revalidateTag(getBookmarkCacheTag(userId));
	waitUntil(streamCacheUpdate.run(userId, "user"));
}

const addPaperToCollectionParams = z.object({
	paperId: z.string(),
	collection: createInsertSchema(collections),
});

export async function addPaperToNewCollection(
	params: z.infer<typeof addPaperToCollectionParams>,
) {
	const { userId } = auth();
	const { paperId, collection } = addPaperToCollectionParams.parse(params);
	if (!userId) {
		return;
	}
	await ensurePaperIsSummarized(paperId);
	await ensurePaperExistsInDb(paperId);
	const existingCollection =
		collection.id === userId
			? await ensureDefaultCollectionExistsInDb(userId)
			: await ensureCollectionExistsInDb(collection);
	await neonDb.insert(collectionsToPapers).values({
		collectionsId: existingCollection.id,
		paperId,
	});

	revalidateTag(getBookmarkCacheTag(userId));
	waitUntil(streamCacheUpdate.run(userId, "user"));
	return {};
}

const ensureDefaultCollectionExistsInDb = (userId: string) =>
	ensureCollectionExistsInDb(getPersonalDefaultCollection(userId));

const ensureCollectionExistsInDb = async (collection: NewCollection) => {
	const existingCollection = await neonDb.query.collections.findFirst({
		where: eq(collections.id, collection.id ?? ""),
	});
	if (existingCollection) {
		return existingCollection;
	}
	const [newCollection] = await neonDb
		.insert(collections)
		.values(collection)
		.returning();
	if (!newCollection) {
		throw new Error("Failed to create collection");
	}
	return newCollection;
};

const ensurePaperIsSummarized = async (paperId: string) => {
	const paper = await fetchPaper(paperId);
	if (paper && !paper.generated) {
		await generate(paper);
	}
};

const ensurePaperExistsInDb = async (paperId: string) => {
	await neonDb.insert(papers).values({ id: paperId }).onConflictDoNothing();
};

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
	waitUntil(streamCacheUpdate.run(userId, "user"));
	return {};
}
