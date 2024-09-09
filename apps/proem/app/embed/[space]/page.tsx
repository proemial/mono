import FeedItem from "@/app/(pages)/(app)/space/(discover)/feed-item";
import { getBookmarkedPapersByCollectionId } from "@/app/(pages)/(app)/space/(discover)/get-bookmarked-papers-by-collection-id";
import { FEED_DEFAULT_DAYS } from "@/app/data/fetch-by-features";
import { fetchFeedByFeaturesWithPostsAndReaders } from "@/app/data/fetch-feed";
import { CollectionService } from "@/services/collection-service";
import { getFeatureFilter } from "@proemial/repositories/oa/fingerprinting/features";
import { fetchFingerprints } from "@proemial/repositories/oa/fingerprinting/fetch-fingerprints";
import { notFound } from "next/navigation";
import React from "react";

// c1:AFD4145,c2:F8F8F8
type Props = {
	params: {
		space: string;
	};
	searchParams: {
		count?: number;
		nopadding?: boolean;
		foreground?: string;
		background?: string;
	};
};

export default async function EmbedPage({
	params: { space },
	searchParams: { count, nopadding, background },
}: Props) {
	const collection = await CollectionService.getCollection(space);
	if (!collection) {
		notFound();
	}

	const bookmarkedPapers = await getBookmarkedPapersByCollectionId(space);
	const paperIds = bookmarkedPapers?.map(({ paperId }) => paperId) ?? [];
	const fingerprints = await fetchFingerprints(paperIds);
	const { filter: features } = getFeatureFilter(fingerprints);

	const limit = count && count < 30 ? count : 10;

	const feed = await fetchFeedByFeaturesWithPostsAndReaders(
		{ features, days: FEED_DEFAULT_DAYS },
		{ limit }, // { offset: ctx.pageParam },
		false,
		space,
	);

	const padding = nopadding ? "" : "p-4";
	const backgroundColor = background ? `bg-[#${background}]` : "";

	return (
		<div
			className={`${padding} grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3`}
		>
			{feed.rows.map((row) => (
				<div
					key={row.paper.id}
					className={`p-3 border border-[#cccccc] ${backgroundColor}`}
				>
					<FeedItem
						paper={row.paper}
						customCollectionId={space}
						readonly={true}
					/>
				</div>
			))}
		</div>
	);
}
