import { and, asc, eq, inArray, isNull, ne, or } from "drizzle-orm";
import { neonDb } from "..";
import {
	Collection,
	NewCollection,
	collections,
	collectionsToPapers,
} from "../neon/schema";

export async function findAvailableCollections(
	userId: string,
	orgId?: string | null,
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

export async function createCollection(
	name: Collection["name"],
	description: Collection["description"] | undefined,
	ownerId: Collection["ownerId"],
	orgId: Collection["orgId"] | undefined,
) {
	return await neonDb
		.insert(collections)
		.values({
			name,
			description,
			ownerId,
			orgId,
			// Default to "org" for org members and "public" for anyone else
			// (can be changed later, in space settings)
			shared: orgId ? "organization" : "public",
		} satisfies NewCollection)
		.returning();
}

export async function updateCollection(
	id: Collection["id"],
	name: Collection["name"],
	description: Collection["description"],
	shared: Collection["shared"],
	orgId: Collection["orgId"],
) {
	return await neonDb
		.update(collections)
		.set({
			name,
			description,
			shared,
			orgId,
		} satisfies Omit<NewCollection, "ownerId">)
		.where(eq(collections.id, id))
		.returning();
}

export async function deleteCollection(collectionId: Collection["id"]) {
	await neonDb
		.update(collections)
		.set({
			deletedAt: new Date(),
		})
		.where(eq(collections.id, collectionId));
}
