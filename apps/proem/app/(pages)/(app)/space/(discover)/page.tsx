import { Feed as FeedComponent } from "@/app/(pages)/(app)/space/(discover)/feed";
import { Feed, defaultFeedFilter } from "@/app/data/feed";
import { OnboardingCarousel } from "@/components/onboarding";
import { getQueryClient } from "@/components/providers/get-query-client";
import { routes } from "@/routes";
import { asInfiniteQueryData } from "@/utils/as-infinite-query-data";
import { getFeedQueryKey } from "@/utils/get-feed-query-key";
import { auth } from "@clerk/nextjs/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { redirect } from "next/navigation";

const getFeed = async () => {
	const offset = 1;
	const feed = await Feed.fromPublic(offset);

	return asInfiniteQueryData(feed);
};

export default async function DiscoverPage() {
	const { userId } = auth();

	if (userId) {
		redirect(`${routes.space}/${userId}`);
	}
	0;
	const queryClient = getQueryClient();

	queryClient.prefetchQuery({
		queryKey: getFeedQueryKey(defaultFeedFilter),
		queryFn: getFeed,
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<OnboardingCarousel />
			<div className="mt-4">
				<FeedComponent filter={defaultFeedFilter} showThemeColors />
			</div>
		</HydrationBoundary>
	);
}
