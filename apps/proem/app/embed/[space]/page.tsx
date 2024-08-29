import { getBookmarkedPapersByCollectionId } from "@/app/(pages)/(app)/space/(discover)/get-bookmarked-papers-by-collection-id";
import { StreamList } from "@/app/(pages)/(app)/space/[collectionId]/(lists)/(latest)/stream-list";
import { FEED_DEFAULT_DAYS } from "@/app/data/fetch-by-features";
import { CollectionService } from "@/services/collection-service";
import { getFeatureFilter } from "@proemial/repositories/oa/fingerprinting/features";
import React from "react";
import { fetchFingerprints } from "@proemial/repositories/oa/fingerprinting/fetch-fingerprints";
import { notFound } from "next/navigation";

type Props = {
	params: {
		space: string;
	};
	searchParams: {
		colors?: string;
	};
};

export default async function EmbedPage({
	params: { space },
	searchParams: { colors },
}: Props) {
	const collection = await CollectionService.getCollection(space);
	if (!collection) {
		notFound();
	}

	const bookmarkedPapers = await getBookmarkedPapersByCollectionId(space);
	const paperIds = bookmarkedPapers?.map(({ paperId }) => paperId) ?? [];
	const fingerprints = await fetchFingerprints(paperIds);
	const { filter: features } = getFeatureFilter(fingerprints);

	return (
		<StreamList
			collectionId={space}
			features={features}
			days={FEED_DEFAULT_DAYS}
			readonly={true}
		/>
	);
}
