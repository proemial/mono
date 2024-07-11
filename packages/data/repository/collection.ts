import { and, asc, eq, inArray, isNull, ne, or } from "drizzle-orm";
import { neonDb } from "..";
import {
	Collection,
	collections,
	collectionsToPapers,
	NewCollection,
} from "../neon/schema";
import { createInsertSchema } from "drizzle-zod";

export const collectionsInsertSchema = createInsertSchema(collections);

export async function findAvailableCollections(
	userId: string,
	orgId: string | undefined,
) {
	const results = await neonDb.query.collections.findMany({
		where: or(
			// User's own spaces
			and(eq(collections.ownerId, userId), isNull(collections.deletedAt)),
			and(
				// Org members' "org" and "public" spaces
				ne(collections.ownerId, userId),
				eq(collections.orgId, orgId ?? ""),
				inArray(collections.shared, ["organization", "public"]),
				isNull(collections.deletedAt),
			),
		),
		orderBy: asc(collections.name),
	});
	return [
		// Put the user's default space first
		...results.filter((c) => c.id === userId),
		...results.filter((c) => c.id !== userId),
	];
}

export async function findCollectionById(id: Collection["id"]) {
	return await neonDb.query.collections.findFirst({
		where: and(eq(collections.id, id), isNull(collections.deletedAt)),
		with: {
			collectionsToPapers: {
				where: eq(collectionsToPapers.isEnabled, true),
				columns: {
					paperId: true,
				},
			},
		},
	});
}

export async function findCollection(collectionId: string) {
	return await neonDb.query.collections.findFirst({
		where: and(eq(collections.id, collectionId), isNull(collections.deletedAt)),
	});
}

export async function findCollectionsByOwnerId(userId: string) {
	const userCollections = await neonDb.query.collections.findMany({
		where: and(eq(collections.ownerId, userId), isNull(collections.deletedAt)),
		orderBy: asc(collections.name),
	});
	return [
		// Put the user's default collection first
		...userCollections.filter((c) => c.id === userId),
		...userCollections.filter((c) => c.id !== userId),
	];
}

export async function getCollectionByCollectionId(collectionId: string) {
	return await neonDb.query.collections.findFirst({
		columns: { id: true },
		where: and(eq(collections.id, collectionId), isNull(collections.deletedAt)),
		with: {
			collectionsToPapers: {
				where: eq(collectionsToPapers.isEnabled, true),
				columns: {
					paperId: true,
					isEnabled: true,
				},
			},
		},
	});
}

export async function getCollectionsByCollectionId(collectionId: string) {
	return await neonDb.query.collections.findMany({
		columns: { id: true },
		where: and(eq(collections.id, collectionId), isNull(collections.deletedAt)),
		with: {
			collectionsToPapers: {
				where: eq(collectionsToPapers.isEnabled, true),
			},
		},
	});
}

export async function toggleCollectionPaper(
	collectionId: string,
	paperId: string,
	isEnabled: boolean,
) {
	await neonDb
		.insert(collectionsToPapers)
		.values({ collectionsId: collectionId, paperId, isEnabled })
		.onConflictDoUpdate({
			target: [collectionsToPapers.paperId, collectionsToPapers.collectionsId],
			set: { isEnabled },
		});
}

export async function addPaperToCollection(
	collectionsId: string,
	paperId: string,
) {
	await neonDb.insert(collectionsToPapers).values({
		collectionsId,
		paperId,
	});
}

export async function getAllSpaceIds() {
	const collections = await neonDb.query.collections.findMany();
	return collections.map((collection) => collection.id);
}

export async function ensureCollectionExistsInDb(collection: NewCollection) {
	const existingCollection = await neonDb.query.collections.findFirst({
		where: and(
			eq(collections.id, collection.id ?? ""),
			isNull(collections.deletedAt),
		),
	});
	if (existingCollection) {
		return existingCollection;
	}
	const [newCollection] = await neonDb
		.insert(collections)
		.values(collection)
		.onConflictDoUpdate({
			target: collections.id,
			set: collection,
		})
		.returning();
	if (!newCollection) {
		throw new Error("Failed to create collection");
	}
	return newCollection;
}
