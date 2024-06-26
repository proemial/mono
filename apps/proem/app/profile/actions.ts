"use server";

import { ratelimitByIpAddress } from "@/utils/ratelimiter";
import {
	OrganizationMembershipPublicUserData,
	auth,
	clerkClient,
} from "@clerk/nextjs/server";
import { neonDb } from "@proemial/data";
import {
	Collection,
	NewCollection,
	collections,
	collectionsToPapers,
} from "@proemial/data/neon/schema";
import {
	findCollectionsByUserId,
	findCollectionsByUserIdAndOrgMembership,
} from "@proemial/data/repository/collection";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const getAvailableCollections = async () => {
	const { userId, orgMemberIds } = await authAndRatelimit();
	return await findCollectionsByUserIdAndOrgMembership(userId, orgMemberIds);
};

export const getOwnCollections = async () => {
	const { userId } = await authAndRatelimit();
	return await findCollectionsByUserId(userId);
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
	const { userId } = await authAndRatelimit();
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

export const deleteCollection = async (collectionId: Collection["id"]) => {
	const { userId } = await authAndRatelimit();

	// Delete any entries in the junction table prior to deleting the collection
	await neonDb
		.delete(collectionsToPapers)
		.where(eq(collectionsToPapers.collectionsId, collectionId));

	revalidatePath("/collection/[id]", "layout");
	return await neonDb
		.delete(collections)
		.where(
			and(eq(collections.id, collectionId), eq(collections.ownerId, userId)),
		)
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

	// Org membership info
	const orgMemberships = authenticatedUser.orgId
		? await clerkClient.organizations.getOrganizationMembershipList({
				organizationId: authenticatedUser.orgId,
			})
		: [];
	const orgMembersUserData = (
		orgMemberships
			.map((membership) => membership.publicUserData)
			.filter(Boolean) as OrganizationMembershipPublicUserData[]
	).sort((a, b) => (a.firstName ?? "").localeCompare(b.firstName ?? ""));

	return {
		userId: authenticatedUser.userId,
		orgMemberIds: orgMembersUserData.map((m) => m.userId),
	};
};
