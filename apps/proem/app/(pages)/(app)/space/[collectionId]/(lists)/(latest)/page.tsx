import { Feed as FeedComponent } from "@/app/(pages)/(app)/space/(discover)/feed";
import { getBookmarksByCollectionId } from "@/app/(pages)/(app)/space/(discover)/get-bookmarks-by-collection-id";
import { CollectionIdParams } from "@/app/(pages)/(app)/space/[collectionId]/params";
import { Feed } from "@/app/data/feed";
import { getQueryClient } from "@/components/providers/get-query-client";
import { CollectionService } from "@/services/collection-service";
import { asInfiniteQueryData } from "@/utils/as-infinite-query-data";
import { getFeedQueryKey } from "@/utils/get-feed-query-key";
import { PermissionUtils } from "@/utils/permission-utils";
import { auth } from "@clerk/nextjs/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { notFound } from "next/navigation";

type Props = CollectionIdParams;

const getFeed = async (collectionId: string, offset = 1) => {
	const feed = await Feed.fromCollection(collectionId, { offset });

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

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<FeedComponent
				filter={filter}
				readonly={!canEdit}
				bookmarks={bookmarks}
			/>
		</HydrationBoundary>
	);
}
