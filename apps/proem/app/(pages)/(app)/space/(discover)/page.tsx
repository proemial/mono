import { Feed } from "@/app/(pages)/(app)/space/(discover)/feed";
import { FEED_DEFAULT_DAYS } from "@/app/data/fetch-by-features";
import { fetchFeedByFeaturesWithPostsAndReaders } from "@/app/data/fetch-feed";
import { OnboardingCarousel } from "@/components/onboarding";
import { getQueryClient } from "@/components/providers/get-query-client";
import { routes } from "@/routes";
import { asInfiniteQueryData } from "@/utils/as-infinite-query-data";
import { getFeedQueryKey } from "@/utils/get-feed-query-key";
import { auth } from "@clerk/nextjs/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { redirect } from "next/navigation";

const filter = {
	features: [],
	days: FEED_DEFAULT_DAYS,
	titles: undefined,
};

const getFeed = async () => {
	const feed = await fetchFeedByFeaturesWithPostsAndReaders(
		{ features: filter.features, days: filter.days },
		{ offset: 1 },
		false,
		undefined,
	);

	return asInfiniteQueryData(feed);
};

export default async function DiscoverPage() {
	const { userId } = auth();

	if (userId) {
		redirect(`${routes.space}/${userId}`);
	}
	const queryClient = getQueryClient();

	queryClient.prefetchQuery({
		queryKey: getFeedQueryKey(filter),
		queryFn: getFeed,
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<OnboardingCarousel />
			<div className="mt-4">
				<Feed filter={filter} showThemeColors />
			</div>
		</HydrationBoundary>
	);
}
