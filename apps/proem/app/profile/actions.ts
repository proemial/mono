"use server";

import { routes } from "@/routes";
import { ratelimitByIpAddress } from "@/utils/ratelimiter";
import { auth } from "@clerk/nextjs/server";
import { neonDb } from "@proemial/data";
import {
	Collection,
	NewCollection,
	collections,
	collectionsToPapers,
} from "@proemial/data/neon/schema";
import { findCollectionsByOwnerIdAndOrgId } from "@proemial/data/repository/collection";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const getAvailableCollections = async () => {
	const { userId, orgId } = await authAndRatelimit();
	return await findCollectionsByOwnerIdAndOrgId(userId, orgId);
};

export const addCollection = async (collection: NewCollection) => {
	await authAndRatelimit();
	const userCollections = await neonDb
		.insert(collections)
		.values(collection)
		.returning();
	return userCollections;
};

export const editCollection = async (collection: Collection) => {
	await authAndRatelimit();
	revalidatePath(`${routes.space}/[id]`, "layout");
	return await neonDb
		.update(collections)
		.set({
			name: collection.name,
			description: collection.description,
		})
		.where(eq(collections.id, collection.id))
		.returning();
};

export const deleteCollection = async (collectionId: Collection["id"]) => {
	await authAndRatelimit();

	// Delete any entries in the junction table prior to deleting the collection
	await neonDb
		.delete(collectionsToPapers)
		.where(eq(collectionsToPapers.collectionsId, collectionId));

	revalidatePath(`${routes.space}/[id]`, "layout");
	return await neonDb
		.delete(collections)
		.where(eq(collections.id, collectionId))
		.returning();
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
