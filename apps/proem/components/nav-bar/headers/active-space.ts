import { Collection } from "@proemial/data/neon/schema";
import { getPersonalDefaultCollection } from "../../../app/constants";

export function getActiveSpace(
	collections: Collection[],
	userId: string | null,
	collectionId?: string,
) {
	const collectionsWithDefaultFallback = ensureDefaultCollection(
		collections,
		userId,
	);
	const selectedSpace =
		collectionId ?? collectionsWithDefaultFallback.at(0)?.id;

	const activeSpace = collectionsWithDefaultFallback.find(
		(collection) => collection.id === selectedSpace,
	);

	return { collectionsWithDefaultFallback, selectedSpace, activeSpace };
}

const ensureDefaultCollection = (
	collections: Collection[],
	userId: string | null,
) => {
	const existingDefaultCollection = collections.find(
		(collection) => collection.id === userId,
	);
	if (existingDefaultCollection) {
		return collections;
	}
	return userId
		? [getPersonalDefaultCollection(userId), ...collections]
		: collections;
};
