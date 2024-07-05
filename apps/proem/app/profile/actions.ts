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
import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const getAvailableCollections = async () => {
	const { userId, orgId } = await authAndRatelimit();
	return await findCollectionsByOwnerIdAndOrgId(userId, orgId);
};

export const addCollection = async (collection: NewCollection) => {
	const { userId, orgId } = await authAndRatelimit();
	const userCollections = await neonDb
		.insert(collections)
		.values({
			name: collection.name,
			description: collection.description,
			ownerId: userId,
			orgId,
		} satisfies NewCollection)
		.returning();
	return userCollections;
};

export const editCollection = async (collection: Collection) => {
	const { userId, orgId } = await authAndRatelimit();
	revalidatePath(`${routes.space}/[id]`, "layout");
	if (collection.ownerId === userId || collection.orgId === orgId) {
		// Allow edit by owning users or org members
		return await neonDb
			.update(collections)
			.set({
				name: collection.name,
				description: collection.description,
			})
			.where(eq(collections.id, collection.id))
			.returning();
	}
};

/**
 * Note: Soft deletion
 */
export const deleteCollection = async (collectionId: Collection["id"]) => {
	const { userId, orgId } = await authAndRatelimit();
	const collection = await neonDb.query.collections.findFirst({
		where: eq(collections.id, collectionId),
	});

	if (collection?.ownerId === userId || collection?.orgId === orgId) {
		// Allow deletion by owning users or org members
		revalidatePath(`${routes.space}/[id]`, "layout");
		return await neonDb
			.update(collections)
			.set({
				deletedAt: new Date(),
			})
			.where(eq(collections.id, collection.id));
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
