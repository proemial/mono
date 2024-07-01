import { getBookmarksByCollectionId } from "@/app/(pages)/(app)/space/(discover)/get-bookmarks-by-collection-id";
import { StreamList } from "@/app/(pages)/(app)/space/[collectionId]/(lists)/(latest)/stream-list";
import { getPaperIdsForCollection } from "@/app/(pages)/(app)/space/[collectionId]/collection-utils";
import { CollectionIdParams } from "@/app/(pages)/(app)/space/[collectionId]/params";
import { FEED_DEFAULT_DAYS } from "@/app/data/fetch-by-features";
import { getBookmarksAndHistory } from "@/app/data/fetch-history";
import { auth } from "@clerk/nextjs";
import { getFeatureFilter } from "@proemial/repositories/oa/fingerprinting/features";
import { fetchFingerprints } from "@proemial/repositories/oa/fingerprinting/fetch-fingerprints";
import { Fingerprint } from "@proemial/repositories/oa/fingerprinting/fingerprints";
import { notFound } from "next/navigation";

type LatestPageProps = CollectionIdParams;

export default async function LatestPage({ params }: LatestPageProps) {
	const { userId } = auth();
	const collectionId = params?.collectionId;
	if (!collectionId || !userId) {
		notFound();
	}

	const [paperIds, bookmarks] = await Promise.all([
		getPaperIdsForCollection(collectionId),
		getBookmarksByCollectionId(collectionId),
	]);

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
		const fingerprintsBasedOnPapers = paperIds
			? await fetchFingerprints(paperIds)
			: [];
		fingerprints.push(...fingerprintsBasedOnPapers);
	}

	const { filter: features } = getFeatureFilter(fingerprints);
	return (
		<StreamList
			id={collectionId}
			features={features}
			days={FEED_DEFAULT_DAYS}
			bookmarks={bookmarks}
		/>
	);
}
