import FeedItem from "@/app/(pages)/(app)/space/(discover)/feed-item";
import { getBookmarkedPapersByCollectionId } from "@/app/(pages)/(app)/space/(discover)/get-bookmarked-papers-by-collection-id";
import { FEED_DEFAULT_DAYS } from "@/app/data/fetch-by-features";
import { fetchFeedByFeaturesWithPosts } from "@/app/data/fetch-feed";
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
	searchParams: { count, nopadding },
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

	const feed = await fetchFeedByFeaturesWithPosts(
		{ features, days: FEED_DEFAULT_DAYS },
		{ limit }, // { offset: ctx.pageParam },
		false,
		space,
	);

	const padding = nopadding ? "" : "p-4";

	return (
		<div
			className={`${padding} flex flex-col sm:flex-row sm:flex-wrap items-start gap-6`}
		>
			{feed.rows.map((row) => (
				<div
					key={row.paper.id}
					className="w-full sm:w-auto sm:flex-1 min-w-[250px]"
				>
					<FeedItem
						paper={row.paper}
						fingerprint={row.features}
						customCollectionId={space}
						readonly={true}
					/>
				</div>
			))}
		</div>
	);
}
