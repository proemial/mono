import { getBookmarksByUserId } from "@/app/(pages)/(app)/space/(discover)/get-bookmarks-by-user-id";
import { StreamList } from "@/app/(pages)/(app)/space/[id]/(latest)/stream-list";
import { FEED_DEFAULT_DAYS } from "@/app/data/fetch-by-features";
import { getBookmarksAndHistory } from "@/app/data/fetch-history";
import { auth } from "@clerk/nextjs";
import { getFeatureFilter } from "@proemial/repositories/oa/fingerprinting/features";
import { fetchFingerprints } from "@proemial/repositories/oa/fingerprinting/fetch-fingerprints";
import { Fingerprint } from "@proemial/repositories/oa/fingerprinting/fingerprints";
import { notFound } from "next/navigation";
import { getPaperIdsForCollection } from "../collection-utils";

type PageProps = {
	params?: {
		id: string;
	};
};

export default async function LatestPage({ params }: PageProps) {
	const { userId } = auth();
	if (!params?.id || !userId) {
		notFound();
	}

	const [paperIds, bookmarks] = await Promise.all([
		getPaperIdsForCollection(params.id),
		getBookmarksByUserId(userId),
	]);

	const isDefaultSpace = params.id === userId;
	const fingerprints: Fingerprint[][] = [];
	if (isDefaultSpace) {
		// Default space uses the user's bookmarks and history to generate the feed
		const history = await getBookmarksAndHistory(userId);
		const fingerprintsBasedOnHistory = await fetchFingerprints(...history);
		fingerprints.push(...fingerprintsBasedOnHistory);
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
			id={params.id}
			features={features}
			days={FEED_DEFAULT_DAYS}
			bookmarks={bookmarks}
		/>
	);
}
