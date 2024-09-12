import { Feed } from "@/app/(pages)/(app)/space/(discover)/feed";
import { CachedFeed, defaultFeedFilter } from "@/app/data/cached-feed";
import { FEED_DEFAULT_DAYS } from "@/app/data/fetch-by-features";
import { fetchFeedByFeaturesWithPostsAndReaders } from "@/app/data/fetch-feed";
import { OnboardingCarousel } from "@/components/onboarding";
import { getQueryClient } from "@/components/providers/get-query-client";
import { routes } from "@/routes";
import { asInfiniteQueryData } from "@/utils/as-infinite-query-data";
import { getFeedQueryKey } from "@/utils/get-feed-query-key";
import { auth } from "@clerk/nextjs/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { unstable_cache } from "next/cache";
import { redirect } from "next/navigation";

const getFeed = async () => {
	const offset = 1;
	const feed = await CachedFeed.fromPublic(offset);

	return asInfiniteQueryData(feed);
};

export default async function DiscoverPage() {
	const { userId } = auth();

	if (userId) {
		redirect(`${routes.space}/${userId}`);
	}
	const queryClient = getQueryClient();

	queryClient.prefetchQuery({
		queryKey: getFeedQueryKey(defaultFeedFilter),
		queryFn: getFeed,
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<OnboardingCarousel />
			<div className="mt-4">
				<Feed filter={defaultFeedFilter} showThemeColors />
			</div>
		</HydrationBoundary>
	);
}
