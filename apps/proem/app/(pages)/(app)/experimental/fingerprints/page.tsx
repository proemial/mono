import { AutocompleteInput } from "@/app/(pages)/(app)/experimental/fingerprints/autocomplete-input";
import { Feed } from "@/app/(pages)/(app)/space/(discover)/feed";
import { getBookmarksByCollectionId } from "@/app/(pages)/(app)/space/(discover)/get-bookmarks-by-collection-id";
import { FEED_DEFAULT_DAYS } from "@/app/data/fetch-by-features";
import { getBookmarksAndHistory } from "@/app/data/fetch-history";
import { FeatureCloud } from "@/components/feature-badges";
import { getQueryClient } from "@/components/providers/get-query-client";
import { auth } from "@clerk/nextjs/server";
import { getFeatureFilter } from "@proemial/repositories/oa/fingerprinting/features";
import { fetchFingerprints } from "@proemial/repositories/oa/fingerprinting/fetch-fingerprints";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
	title: "Fingerprints",
};

type Props = {
	searchParams?: {
		ids?: string;
		days?: string;
		weights?: string; // weights=c:0.5,t:1.1,k:0.9
		clean?: boolean;
		nocache?: boolean;
	};
};

export default async function FingerprintsPage({ searchParams }: Props) {
	const { userId } = auth();
	const queryClient = getQueryClient();
	const params = {
		ids: searchParams?.ids?.length ? searchParams.ids : undefined,
		days: searchParams?.days
			? Number.parseInt(searchParams.days)
			: FEED_DEFAULT_DAYS,
	};

	const bookmarks = userId ? await getBookmarksByCollectionId(userId) : null;
	const ids = params.ids?.split(",") ?? [];

	// Only use history when `ids` param is missing (accept clearing the list of papers)
	const noIds = searchParams?.ids === undefined;
	if (noIds && !ids.length) {
		const history = userId ? await getBookmarksAndHistory(userId) : [];
		if (history?.length) {
			redirect(`/experimental/fingerprints?ids=${history.flat().join(",")}`);
		}
	}

	const fingerprints = await fetchFingerprints(ids);
	const { allFeatures, filter } = getFeatureFilter(
		fingerprints,
		searchParams?.weights,
	);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<div className="pt-8 space-y-6">
				<Feed
					filter={{ features: filter, days: params.days }}
					bookmarks={bookmarks}
				>
					<AutocompleteInput />
					{!searchParams?.clean && <FeatureCloud features={allFeatures} />}
				</Feed>
			</div>
		</HydrationBoundary>
	);
}
