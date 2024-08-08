import { CollectionService } from "@/services/collection-service";
import { findAvailableCollections } from "@proemial/data/repository/collection";
import { notFound } from "next/navigation";

export async function getAvailableCollections(
	collectionId: string,
	userId?: string | null,
	orgId?: string | null,
) {
	const collectionFromParams = await CollectionService.getCollection(
		collectionId,
		userId,
		orgId,
	);
	if (!collectionFromParams) {
		notFound();
	}

	const availableCollections = userId
		? await findAvailableCollections(userId, orgId)
		: [];
	const containsCollection = availableCollections.some(
		(c) => c.id === collectionFromParams.id,
	);
	const combinedCollections = containsCollection
		? availableCollections
		: [...availableCollections, collectionFromParams].sort((a, b) =>
				a.name.localeCompare(b.name),
			);

	return combinedCollections;
}
