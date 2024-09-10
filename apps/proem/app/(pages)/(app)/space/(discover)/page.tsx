import { Feed } from "@/app/(pages)/(app)/space/(discover)/feed";
import { FEED_DEFAULT_DAYS } from "@/app/data/fetch-by-features";
import { fetchFeedByFeaturesWithPostsAndReaders } from "@/app/data/fetch-feed";
import { OnboardingCarousel } from "@/components/onboarding";
import { getQueryClient } from "@/components/providers/get-query-client";
import { routes } from "@/routes";
import { auth } from "@clerk/nextjs/server";
import { getFeedback } from "@sentry/nextjs";
import {
	HydrationBoundary,
	QueryClient,
	dehydrate,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { Suspense } from "react";
// import { getFeed } from "./get-feed";
const getFeed = async () => ({
	pages: [
		{
			count: 100,
			nextOffset: 2,
			rows: [
				{ id: "1", from: "server" },
				{ id: "2", from: "server" },
				{ id: "3", from: "server" },
				{ id: "4", from: "server" },
				{ id: "5", from: "server" },
			],
		},
	],
	pageParams: [1],
});

export default async function DiscoverPage() {
	const { userId } = auth();

	if (userId) {
		redirect(`${routes.space}/${userId}`);
	}
	const queryClient = getQueryClient();

	const filter = {
		features: [],
		days: FEED_DEFAULT_DAYS,
		titles: undefined,
	};

	queryClient.prefetchQuery({
		queryKey: ["test3"],
		queryFn: getFeed,
		// fetchFeedByFeaturesWithPostsAndReaders(
		// 	{ features: filter.features, days: filter.days },
		// 	{ offset: 0 },
		// 	false,
		// 	undefined,
		// ),
	});

	return (
		// Neat! Serialization is now as easy as passing props.
		// HydrationBoundary is a Client Component, so hydration will happen there.
		<HydrationBoundary state={dehydrate(queryClient)}>
			<OnboardingCarousel />
			<div className="mt-4">
				<Feed filter={filter} showThemeColors />
			</div>
		</HydrationBoundary>
	);
}
