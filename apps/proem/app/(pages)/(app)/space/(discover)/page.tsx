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
import { Suspense } from "react";

const getFeed = async () => {
	const offset = 1;
	const feed = await Feed.fromPublic(offset);

	return asInfiniteQueryData(feed);
};

export const dynamic = "force-static";

export default async function DiscoverPage() {
	// const { userId } = auth();

	// if (userId) {
	// 	redirect(`${routes.space}/${userId}`);
	// }
	const queryClient = getQueryClient();

	queryClient.prefetchQuery({
		queryKey: getFeedQueryKey(defaultFeedFilter),
		queryFn: getFeed,
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<OnboardingCarousel />
			<Suspense fallback={<div>Loading...</div>}>
				<div className="mt-4">
					<FeedComponent filter={defaultFeedFilter} showThemeColors />
				</div>
			</Suspense>
		</HydrationBoundary>
	);
}
