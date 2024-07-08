"use server";

import { routes } from "@/routes";
import { ratelimitByIpAddress } from "@/utils/ratelimiter";
import { auth } from "@clerk/nextjs/server";
import { neonDb } from "@proemial/data";
import {
	Collection,
	NewCollection,
	collections,
} from "@proemial/data/neon/schema";
import { findAvailableCollections } from "@proemial/data/repository/collection";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const getAvailableCollections = async () => {
	const { userId, orgId } = await authAndRatelimit();
	return await findAvailableCollections(userId, orgId);
};

export const addCollection = async (collection: NewCollection) => {
	const { userId, orgId } = await authAndRatelimit();
	const [result] = await neonDb
		.insert(collections)
		.values({
			name: collection.name,
			description: collection.description,
			ownerId: userId,
			orgId,
			// Default to "org" for org members and "public" for anyone else
			// (can be changed later, in space settings)
			shared: orgId ? "organization" : "public",
		} satisfies NewCollection)
		.returning();
	return result;
};

export const editCollection = async (collection: Collection) => {
	const { userId, orgId } = await authAndRatelimit();
	if (collection.ownerId === userId || collection.orgId === orgId) {
		// Allow edits by owner and org members
		const [result] = await neonDb
			.update(collections)
			.set({
				name: collection.name,
				description: collection.description,
				shared: collection.shared,
			} satisfies Omit<NewCollection, "ownerId">)
			.where(eq(collections.id, collection.id))
			.returning();
		revalidatePath(`${routes.space}/[id]`, "layout");
		return result;
	}
};

export const deleteCollection = async (collectionId: Collection["id"]) => {
	// Note: This is doing soft delete
	const { userId, orgId } = await authAndRatelimit();
	const collection = await neonDb.query.collections.findFirst({
		where: eq(collections.id, collectionId),
	});

	if (!collection || collection.deletedAt) {
		return;
	}

	if (collection.ownerId === userId || collection.orgId === orgId) {
		// Allow deletion by owning users or org members
		await neonDb
			.update(collections)
			.set({
				deletedAt: new Date(),
			})
			.where(eq(collections.id, collection.id));
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
