"use server";

import { ratelimitByIpAddress } from "@/utils/ratelimiter";
import { auth } from "@clerk/nextjs/server";
import { neonDb } from "@proemial/data";
import {
	Collection,
	NewCollection,
	collections,
} from "@proemial/data/neon/schema";
import { and, asc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const getCollections = async (userId: string) => {
	await authAndRatelimit(userId);
	return neonDb.query.collections.findMany({
		where: eq(collections.ownerId, userId),
		orderBy: [asc(collections.name)],
	});
};

export const addCollection = async (
	userId: string,
	collection: NewCollection,
) => {
	await authAndRatelimit(userId);
	const userCollections = await neonDb
		.insert(collections)
		.values(collection)
		.returning();
	return userCollections;
};

export const editCollection = async (
	userId: string,
	collection: Collection,
) => {
	await authAndRatelimit(userId);
	revalidatePath("/collection/[id]", "layout");
	return await neonDb
		.update(collections)
		.set({
			name: collection.name,
			description: collection.description,
		})
		.where(
			and(eq(collections.id, collection.id), eq(collections.ownerId, userId)),
		)
		.returning();
};

export const deleteCollection = async (
	userId: string,
	collectionId: Collection["id"],
) => {
	await authAndRatelimit(userId);
	revalidatePath("/collection/[id]", "layout");
	return await neonDb
		.delete(collections)
		.where(
			and(eq(collections.id, collectionId), eq(collections.ownerId, userId)),
		)
		.returning();
};

const authAndRatelimit = async (userId: string) => {
	// Auth
	const authenticatedUser = auth();
	if (!authenticatedUser || authenticatedUser.userId !== userId) {
		throw new Error("Unauthorized");
	}
	// Rate limit
	const ip = headers().get("x-forwarded-for") ?? headers().get("x-real-ip");
	const { success } = await ratelimitByIpAddress(ip);
	if (!success) {
		throw new Error("Rate limit exceeded");
	}
};
