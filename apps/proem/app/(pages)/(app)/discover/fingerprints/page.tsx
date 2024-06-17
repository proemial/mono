import { getBookmarksByUserId } from "@/app/(pages)/(app)/discover/get-bookmarks-by-user-id";
import { FEED_DEFAULT_DAYS } from "@/app/data/fetch-by-features";
import { getBookmarksAndHistory } from "@/app/data/fetch-history";
import { getInternalUser } from "@/app/hooks/get-internal-user";
import { FeatureCloud } from "@/components/feature-badges";
import { Main } from "@/components/main";
import { GoBackAction } from "@/components/nav-bar/actions/go-back-action";
import { SelectSpaceHeader } from "@/components/nav-bar/headers/select-space-header";
import { NavBarV2 } from "@/components/nav-bar/nav-bar-v2";
import { auth } from "@clerk/nextjs";
import { getFeatureFilter } from "@proemial/repositories/oa/fingerprinting/features";
import { fetchFingerprints } from "@proemial/repositories/oa/fingerprinting/fetch-fingerprints";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Feed } from "../feed";
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
	const { isInternal } = getInternalUser();
	const { userId } = await auth();
	const params = {
		ids: searchParams?.ids?.length ? searchParams.ids : undefined,
		days: searchParams?.days
			? Number.parseInt(searchParams.days)
			: FEED_DEFAULT_DAYS,
	};

	const bookmarks = userId ? await getBookmarksByUserId(userId) : {};
	const ids = params.ids?.split(",") ?? [];

	// Only use history when `ids` param is missing (accept clearing the list of papers)
	const noIds = searchParams?.ids === undefined;
	if (noIds && !ids.length) {
		const history = await getBookmarksAndHistory();
		if (history.length) {
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

	return (
		<>
			<NavBarV2 action={<GoBackAction />} isInternalUser={isInternal}>
				<SelectSpaceHeader />
			</NavBarV2>
			<Main>
				<div className="space-y-6">
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
