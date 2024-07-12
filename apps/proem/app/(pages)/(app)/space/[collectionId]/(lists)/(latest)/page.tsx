import { getBookmarkedPapersByCollectionId } from "@/app/(pages)/(app)/space/(discover)/get-bookmarked-papers-by-collection-id";
import { StreamList } from "@/app/(pages)/(app)/space/[collectionId]/(lists)/(latest)/stream-list";
import {
	CollectionIdParams,
	StreamDebugParams,
} from "@/app/(pages)/(app)/space/[collectionId]/params";
import { FEED_DEFAULT_DAYS } from "@/app/data/fetch-by-features";
import { getBookmarksAndHistory } from "@/app/data/fetch-history";
import { ProemAssistant } from "@/components/proem-assistant";
import { CollectionService } from "@/services/collection-service";
import { PermissionUtils } from "@/utils/permission-utils";
import { auth } from "@clerk/nextjs";
import { getFeatureFilter } from "@proemial/repositories/oa/fingerprinting/features";
import { fetchFingerprints } from "@proemial/repositories/oa/fingerprinting/fetch-fingerprints";
import { Fingerprint } from "@proemial/repositories/oa/fingerprinting/fingerprints";
import { notFound } from "next/navigation";

type Props = CollectionIdParams & {
	searchParams?: StreamDebugParams;
};

export default async function LatestPage({
	params: { collectionId },
	searchParams,
}: Props) {
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

	const bookmarkedPapers =
		await getBookmarkedPapersByCollectionId(collectionId);

	const paperIds = bookmarkedPapers?.map(({ paperId }) => paperId);

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
		<>
			<StreamList
				collectionId={collectionId}
				debugParams={searchParams}
				features={features}
				days={FEED_DEFAULT_DAYS}
				bookmarks={paperIds}
				readonly={!canEdit}
			/>
			<ProemAssistant />
		</>
	);
}
