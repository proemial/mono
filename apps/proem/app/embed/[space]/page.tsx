import FeedItem from "@/app/(pages)/(app)/space/(discover)/feed-item";
import { getBookmarkedPapersByCollectionId } from "@/app/(pages)/(app)/space/(discover)/get-bookmarked-papers-by-collection-id";
import { FEED_DEFAULT_DAYS } from "@/app/data/fetch-by-features";
import { fetchFeedByFeaturesWithPostsAndReaders } from "@/app/data/fetch-feed";
import { ProemLogo } from "@/components/icons/brand/logo";
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
	searchParams: { count, background },
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
		space,
	);

	const style = background ? { background: `#${background}` } : {};

	return (
		<div className={"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"}>
			{feed.rows.map((row) => (
				<div
					key={row.paper.id}
					className={"p-3 border border-[#cccccc]"}
					style={style}
				>
					<FeedItem
						paper={row.paper}
						customCollectionId={space}
						readonly={true}
						embedded={true}
					/>
					<div className="relative bottom-4 flex justify-end">
						<ProemLogo className="w-4 h-4" />
					</div>
				</div>
			))}
		</div>
	);
}
