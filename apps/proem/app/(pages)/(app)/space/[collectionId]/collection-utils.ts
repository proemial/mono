import { findCollectionById } from "@proemial/data/repository/collection";

export const getPaperIdsForCollection = async (collectionId: string) => {
	const collection = await findCollectionById(collectionId);

	return collection?.collectionsToPapers.map(({ paperId }) => paperId);
};
