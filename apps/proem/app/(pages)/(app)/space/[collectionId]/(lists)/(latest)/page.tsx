import { Feed } from "@/app/(pages)/(app)/space/(discover)/feed";
import { getBookmarksByCollectionId } from "@/app/(pages)/(app)/space/(discover)/get-bookmarks-by-collection-id";
import { CollectionIdParams } from "@/app/(pages)/(app)/space/[collectionId]/params";
import { FEED_DEFAULT_DAYS } from "@/app/data/fetch-by-features";
import { getBookmarksAndHistory } from "@/app/data/fetch-history";
import { CollectionService } from "@/services/collection-service";
import { PermissionUtils } from "@/utils/permission-utils";
import { auth } from "@clerk/nextjs/server";
import { getFeatureFilter } from "@proemial/repositories/oa/fingerprinting/features";
import { fetchFingerprints } from "@proemial/repositories/oa/fingerprinting/fetch-fingerprints";
import { Fingerprint } from "@proemial/repositories/oa/fingerprinting/fingerprints";
import { notFound } from "next/navigation";

type Props = CollectionIdParams;

export default async function LatestPage({ params: { collectionId } }: Props) {
	const { userId, orgId } = auth();
	const collection = await CollectionService.getCollection(
		collectionId,
		userId,
		orgId,
	);
	if (!collection) {
		notFound();
	}
	const canEdit = PermissionUtils.canEditCollection(collection, userId, orgId);

	const bookmarks = await getBookmarksByCollectionId(collectionId);
	const bookmarkedPapersInCurrentSpace = Object.keys(bookmarks).filter(
		(paperId) => bookmarks[paperId]?.includes(collectionId),
	);

	const isDefaultSpace = collectionId === userId;
	const fingerprints: Fingerprint[][] = [];
	if (isDefaultSpace) {
		// Default space uses the user's bookmarks and history to generate the feed
		const history = await getBookmarksAndHistory(userId);
		if (history?.length) {
			const fingerprintsBasedOnHistory = await fetchFingerprints(...history);
			fingerprints.push(...fingerprintsBasedOnHistory);
		}
	} else {
		// Custom spaces use the papers in the space to generate the feed
		const fingerprintsBasedOnPapers = bookmarkedPapersInCurrentSpace
			? await fetchFingerprints(bookmarkedPapersInCurrentSpace)
			: [];
		fingerprints.push(...fingerprintsBasedOnPapers);
	}

	const { filter: features } = getFeatureFilter(fingerprints);

	const filter = {
		features,
		collectionId,
		days: FEED_DEFAULT_DAYS,
	};

	return <Feed filter={filter} readonly={!canEdit} bookmarks={bookmarks} />;
}
