"use server";

import { routes } from "@/routes";
import { ratelimitByIpAddress } from "@/utils/ratelimiter";
import { auth } from "@clerk/nextjs/server";
import { Collection, NewCollection } from "@proemial/data/neon/schema";
import {
	createCollection,
	findAvailableCollections,
	findCollection,
	updateCollection,
	deleteCollection as deleteCollectionFromDb,
} from "@proemial/data/repository/collection";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const getAvailableCollections = async () => {
	const { userId, orgId } = await authAndRatelimit();
	return await findAvailableCollections(userId, orgId);
};

export const addCollection = async (collection: NewCollection) => {
	const { userId, orgId } = await authAndRatelimit();
	const [result] = await createCollection(
		collection.name,
		collection.description,
		userId,
		orgId,
	);
	revalidatePath(`${routes.space}/[id]`, "layout");
	return result;
};

export const editCollection = async (collection: Collection) => {
	const { userId, orgId } = await authAndRatelimit();

	async function doEditCollection() {
		const isOrgAccessible =
			orgId && ["organization", "public"].includes(collection.shared);
		const [result] = await updateCollection(
			collection.id,
			collection.name,
			collection.description,
			collection.shared,
			isOrgAccessible ? orgId : null,
		);
		revalidatePath(`${routes.space}/[id]`, "layout");
		return result;
	}

	switch (collection.shared) {
		case "private": {
			if (collection.ownerId === userId) {
				// Allow edits by owner
				return await doEditCollection();
			}
			break;
		}
		case "organization":
		case "public": {
			if (collection.ownerId === userId || collection.orgId === orgId) {
				// Allow edits by owner and org members
				return await doEditCollection();
			}
			break;
		}
	}
};

export const deleteCollection = async (collectionId: Collection["id"]) => {
	// Note: This is doing soft delete
	const { userId, orgId } = await authAndRatelimit();
	const collection = await findCollection(collectionId);

	if (!collection || collection.deletedAt) {
		return;
	}

	if (collection.ownerId === userId || collection.orgId === orgId) {
		// Allow deletion by owning users or org members
		await deleteCollectionFromDb(collection.id);
		revalidatePath(`${routes.space}/[id]`, "layout");
	}
};

const authAndRatelimit = async () => {
	// Auth
	const authenticatedUser = auth();
	if (!authenticatedUser || !authenticatedUser.userId) {
		throw new Error("Unauthorized");
	}
	// Rate limit
	const ip = headers().get("x-forwarded-for") ?? headers().get("x-real-ip");
	const { success } = await ratelimitByIpAddress(ip);
	if (!success) {
		throw new Error("Rate limit exceeded");
	}

	return {
		userId: authenticatedUser.userId,
		orgId: authenticatedUser.orgId,
	};
};
