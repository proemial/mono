import { getBookmarksByCollectionId } from "@/app/(pages)/(app)/space/(discover)/get-bookmarks-by-collection-id";
import { FEED_DEFAULT_DAYS } from "@/app/data/fetch-by-features";
import { getBookmarksAndHistory } from "@/app/data/fetch-history";
import { FeatureCloud } from "@/components/feature-badges";
import { Main } from "@/components/main";
import { CloseAction } from "@/components/nav-bar/actions/close-action";
import { SelectSpaceHeader } from "@/components/nav-bar/headers/select-space-header";
import { SimpleHeader } from "@/components/nav-bar/headers/simple-header";
import { NavBar } from "@/components/nav-bar/nav-bar";
import { routes } from "@/routes";
import { auth } from "@clerk/nextjs";
import { findCollectionsByOwnerId } from "@proemial/data/repository/collection";
import { getFeatureFilter } from "@proemial/repositories/oa/fingerprinting/features";
import { fetchFingerprints } from "@proemial/repositories/oa/fingerprinting/fetch-fingerprints";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Feed } from "../../space/(discover)/feed";
import { AutocompleteInput } from "./autocomplete-input";

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
	const params = {
		ids: searchParams?.ids?.length ? searchParams.ids : undefined,
		days: searchParams?.days
			? Number.parseInt(searchParams.days)
			: FEED_DEFAULT_DAYS,
	};

	const bookmarks = userId ? await getBookmarksByCollectionId(userId) : {};
	const ids = params.ids?.split(",") ?? [];

	// Only use history when `ids` param is missing (accept clearing the list of papers)
	const noIds = searchParams?.ids === undefined;
	if (noIds && !ids.length) {
		const history = await getBookmarksAndHistory();
		if (history?.length) {
			redirect(
				`/discover/fingerprints?ids=${history.flatMap((i) => i).join(",")}`,
			);
		}
	}

	const fingerprints = await fetchFingerprints(ids);
	const { allFeatures, filter } = getFeatureFilter(
		fingerprints,
		searchParams?.weights,
	);
	const userCollections = userId ? await findCollectionsByOwnerId(userId) : [];

	return (
		<>
			<NavBar action={<CloseAction target={routes.space} />}>
				{userCollections.length > 0 ? (
					<SelectSpaceHeader collections={userCollections} userId={userId} />
				) : (
					<SimpleHeader title="For You" />
				)}
			</NavBar>
			<Main>
				<div className="pt-8 space-y-6">
					<Feed
						filter={{ features: filter, days: params.days }}
						debug={!searchParams?.clean}
						nocache={searchParams?.nocache}
						bookmarks={bookmarks}
					>
						<AutocompleteInput />
						{!searchParams?.clean && <FeatureCloud features={allFeatures} />}
					</Feed>
				</div>
			</Main>
		</>
	);
}
