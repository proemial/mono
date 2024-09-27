"use server";
import FeedItem, {
	FeedPaper,
} from "@/app/(pages)/(app)/space/(discover)/feed-item";
import { getBookmarkedPapersByCollectionId } from "@/app/(pages)/(app)/space/(discover)/get-bookmarked-papers-by-collection-id";
import { getFieldFromOpenAlexTopics } from "@/app/(pages)/(app)/space/(discover)/get-field-from-open-alex-topics";
import { FEED_DEFAULT_DAYS } from "@/app/data/fetch-by-features";
import { fetchFeedByFeaturesWithPostsAndReaders } from "@/app/data/fetch-feed";
import { ProemLogo } from "@/components/icons/brand/logo";
import { GotoSpaceButton, SpaceName } from "@/components/space-name-button";
import { ThemeColoredCard } from "@/components/theme-colored-card";
import { CollectionService } from "@/services/collection-service";
import { auth } from "@clerk/nextjs/server";
import {
	getFeatureFilter,
	RankedFeature,
} from "@proemial/repositories/oa/fingerprinting/features";
import { fetchFingerprints } from "@proemial/repositories/oa/fingerprinting/fetch-fingerprints";
import { Header4 } from "@proemial/shadcn-ui";
import React from "react";
import { unstable_cache as cache } from "next/cache";
import { Time } from "@proemial/utils/time";

const CACHE_FOR = 60 * 5;

type Props = {
	space: string;
	count?: number;
	background?: string;
	embedded?: boolean;
	filter?: (paper: FeedPaper) => boolean;
};

async function getCollection(
	space: string,
	userId?: string | null,
	orgId?: string | null,
) {
	const begin = Time.now();

	try {
		const { userId, orgId } = auth();
		return await CollectionService.getCollection(space, userId, orgId);
	} finally {
		Time.log(begin, `[embed][collection] ${space} ${userId} ${orgId}`);
	}
}

async function getPaperIds(space: string) {
	return cache(
		async () => {
			const begin = Time.now();

			try {
				const bookmarkedPapers = await getBookmarkedPapersByCollectionId(space);
				return bookmarkedPapers?.map(({ paperId }) => paperId) ?? [];
			} finally {
				Time.log(begin, `[embed][ids] ${space}`);
			}
		},
		["embed.ids", space],
		{ revalidate: CACHE_FOR, tags: ["embed.ids"] },
	)();
}

async function getCachedFingerprints(paperIds: string[]) {
	return cache(
		async () => {
			console.log("Rebuilding fingerprints cache for", paperIds.length);
			return await fetchFingerprints(paperIds);
		},
		["embed.fingerprints", JSON.stringify(paperIds)],
		{ revalidate: CACHE_FOR, tags: ["embed.fingerprints"] },
	)();
}

async function getFeed(
	space: string,
	features: RankedFeature[],
	limit: number,
) {
	const begin = Time.now();

	try {
		return await fetchFeedByFeaturesWithPostsAndReaders(
			{ features, days: FEED_DEFAULT_DAYS },
			{ limit: limit + 1 }, // +1 in case the filter below removes one
			space,
		);
	} finally {
		Time.log(begin, `[embed][feed] ${space}`);
	}
}

export async function SpacePapers({
	space,
	count,
	background,
	embedded,
	filter: paperFilter,
}: Props) {
	const { userId, orgId } = auth();
	const collection = await getCollection(space, userId, orgId);

	if (!collection) {
		return undefined;
	}

	const paperIds = await getPaperIds(space);

	const fingerprints = await getCachedFingerprints(paperIds);
	const { filter: features } = getFeatureFilter(fingerprints);

	const limit = count && count < 30 ? count : 10;

	const feed = await getFeed(space, features, limit);

	if (!feed) {
		return null;
	}

	const filter = paperFilter ?? (() => true);

	return (
		<>
			{!embedded && (
				<Header4>
					<SpaceName collectionId={space}>More papers from</SpaceName>
				</Header4>
			)}

			{feed.rows
				.filter((r) => filter(r.paper))
				.slice(0, limit)
				.map((row) => (
					<SpacePaper
						key={row.paper.id}
						paper={row.paper}
						space={space}
						background={background}
						embedded={embedded}
					/>
				))}

			{!embedded && (
				<div className="text-center pt-4">
					<GotoSpaceButton collectionId={space} />
				</div>
			)}
		</>
	);
}

function SpacePaper({
	paper,
	space,
	background,
	embedded,
}: {
	paper: FeedPaper;
	space: string;
	background?: string;
	embedded?: boolean;
}) {
	const topics = paper.data.topics;
	const field = topics && getFieldFromOpenAlexTopics(topics);

	const style = background ? { background } : {};
	const item = (
		<FeedItem
			paper={paper}
			customCollectionId={space}
			readonly={true}
			embedded={embedded}
		/>
	);

	if (embedded) {
		return (
			<div
				key={paper.id}
				className={"p-3 border border-[#cccccc]"}
				style={style}
			>
				{item}

				<div className="relative bottom-4 flex justify-end">
					<ProemLogo className="w-4 h-4" />
				</div>
			</div>
		);
	}

	if (field) {
		return <ThemeColoredCard theme={field?.theme}>{item}</ThemeColoredCard>;
	}

	return item;
}
