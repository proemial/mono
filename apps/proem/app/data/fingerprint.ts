import { getBookmarksByCollectionId } from "@/app/(pages)/(app)/space/(discover)/get-bookmarks-by-collection-id";
import { getBookmarksAndHistory } from "@/app/data/fetch-history";
import { fetchFingerprints } from "@proemial/repositories/oa/fingerprinting/fetch-fingerprints";

export module Fingerprint {
	const fingerprintsFromHistory = async (userId: string) => {
		// Default space uses the user's bookmarks and history to generate the feed
		const history = await getBookmarksAndHistory(userId);
		if (history?.length) {
			return await fetchFingerprints(...history);
		}
		return [];
	};

	const fingerprintFromBookmarks = async (collectionId: string) => {
		const bookmarks = await getBookmarksByCollectionId(collectionId);
		const bookmarkedPapersInCurrentSpace = Object.keys(bookmarks).filter(
			(paperId) => bookmarks[paperId]?.includes(collectionId),
		);

		if (bookmarkedPapersInCurrentSpace?.length) {
			return await fetchFingerprints(bookmarkedPapersInCurrentSpace);
		}
		return [];
	};

	export const fromCollection = async (collectionId: string) => {
		const isDefaultSpace = collectionId.startsWith("user_");

		const fingerprints = isDefaultSpace
			? await fingerprintsFromHistory(collectionId)
			: await fingerprintFromBookmarks(collectionId);

		return fingerprints;
	};
}
