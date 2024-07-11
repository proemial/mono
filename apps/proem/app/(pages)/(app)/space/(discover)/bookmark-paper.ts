"use server";

import {
	getBookmarkCacheTag,
	getBookmarkedPapersCacheTag,
	getPersonalDefaultCollection,
} from "@/app/constants";
import { streamCacheUpdate } from "@/inngest/populator.task";
import { PermissionUtils } from "@/utils/permission-utils";
import { auth } from "@clerk/nextjs";
import { NewCollection } from "@proemial/data/neon/schema";
import {
	addPaperToCollection,
	ensureCollectionExistsInDb,
	findCollection,
	toggleCollectionPaper,
} from "@proemial/data/repository/collection";
import { ensurePaperExistsInDb } from "@proemial/data/repository/paper";
import { waitUntil } from "@vercel/functions";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { fetchPaper } from "../../paper/oa/[id]/fetch-paper";
import { generate } from "../../paper/oa/[id]/llm-generate";

type Params = {
	paperId: string;
	collection: NewCollection;
};

export async function addPaperToNewCollection(params: Params) {
	const { userId } = auth();
	if (!userId) {
		return;
	}

	const { paperId, collection } = params;

	await ensurePaperIsSummarized(paperId);
	await ensurePaperExistsInDb(paperId);
	// Create new collection
	const existingCollection =
		collection.id === userId
			? await ensureDefaultCollectionExistsInDb(userId)
			: await ensureCollectionExistsInDb(collection);

	await addPaperToCollection(existingCollection.id, paperId);

	revalidateTag(getBookmarkCacheTag(existingCollection.id));
	revalidateTag(getBookmarkedPapersCacheTag(existingCollection.id));
	waitUntil(streamCacheUpdate.run(userId, "user"));
	return {};
}

const ensureDefaultCollectionExistsInDb = (userId: string) =>
	ensureCollectionExistsInDb(getPersonalDefaultCollection(userId));

const ensurePaperIsSummarized = async (paperId: string) => {
	const paper = await fetchPaper(paperId);
	if (paper && !paper.generated) {
		await generate(paper);
	}
};

const togglePaperInCollectionParams = z.object({
	paperId: z.string(),
	collectionId: z.string(),
	isEnabled: z.boolean(),
	// TODO: Hacky solution
	revalidateCache: z.boolean().optional(),
});

export async function togglePaperInCollection(
	params: z.infer<typeof togglePaperInCollectionParams>,
) {
	const { userId, orgId } = auth();
	const { paperId, collectionId, isEnabled, revalidateCache } =
		togglePaperInCollectionParams.parse(params);

	const collection = await findCollection(collectionId);
	if (
		// For non-default spaces, require edit permissions
		collectionId !== userId &&
		(!collection ||
			!PermissionUtils.canEditCollection(collection, userId, orgId))
	) {
		return;
	}
	// TODO! Consider moving to better?
	await ensurePaperIsSummarized(paperId);
	await ensurePaperExistsInDb(paperId);
	if (collectionId === userId) {
		// This is necessary because the default collection is created lazily
		await ensureDefaultCollectionExistsInDb(userId);
	}

	await toggleCollectionPaper(collectionId, paperId, isEnabled);

	if (revalidateCache !== false) {
		revalidateTag(getBookmarkedPapersCacheTag(collectionId));
		revalidateTag(getBookmarkCacheTag(collectionId));
		if (userId) waitUntil(streamCacheUpdate.run(userId, "user"));
	}

	return {};
}
