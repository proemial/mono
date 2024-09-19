import { Feed as FeedComponent } from "@/app/(pages)/(app)/space/(discover)/feed";
import { getBookmarksByCollectionId } from "@/app/(pages)/(app)/space/(discover)/get-bookmarks-by-collection-id";
import { CollectionIdParams } from "@/app/(pages)/(app)/space/[collectionId]/params";
import { Feed } from "@/app/data/feed";
import { Fingerprint } from "@/app/data/fingerprint";
import { FeatureCloud } from "@/components/feature-badges";
import { getQueryClient } from "@/components/providers/get-query-client";
import { getDebugFlags } from "@/feature-flags/debug-flag";
import { CollectionService } from "@/services/collection-service";
import { asInfiniteQueryData } from "@/utils/as-infinite-query-data";
import { getFeedQueryKey } from "@/utils/get-feed-query-key";
import { PermissionUtils } from "@/utils/permission-utils";
import { auth } from "@clerk/nextjs/server";
import {
	Feature,
	getFeatureFilter,
	RankedFeature,
} from "@proemial/repositories/oa/fingerprinting/features";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";

type Props = CollectionIdParams;

const getFeed = async (collectionId: string) => {
	const feed = await Feed.fromCollection(collectionId, {
		offset: 1,
		limit: 10,
	});

	return asInfiniteQueryData(feed);
};

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

	const queryClient = getQueryClient();
	const filter = { collectionId };

	queryClient.prefetchQuery({
		queryKey: getFeedQueryKey(filter),
		queryFn: () => getFeed(collectionId),
	});

	const [debug] = await getDebugFlags();
	const allFeatures = await getFeatures(collectionId, debug);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<FeedComponent
				filter={filter}
				readonly={!canEdit}
				bookmarks={bookmarks}
				debug={debug}
			>
				{debug && (
					<FeatureCloud
						features={allFeatures}
						title="features in filter"
						collapsible
					/>
				)}
			</FeedComponent>
		</HydrationBoundary>
	);
}

async function getFeatures(collectionId: string, debug?: boolean) {
	if (!debug) {
		return [];
	}

	const fingerprints = await unstable_cache(
		async () => await Fingerprint.fromCollection(collectionId),
		["fingerprint", collectionId],
		{
			revalidate: false,
		},
	)();
	const { filter: features } = getFeatureFilter(fingerprints);

	return features;
}
