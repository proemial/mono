import { fetchFingerprints } from "@/components/fingerprints/fetch-fingerprints";
import { getFeatureFilter } from "@/components/fingerprints/features";
import { FeatureCloud } from "@/components/fingerprints/feature-cloud";
import { AutocompleteInput } from "./autocomplete-input";
import { getHistory } from "@/components/fingerprints/fetch-history";
import { redirect } from "next/navigation";
import { Feed } from "../feed";
import { Metadata } from "next";
import { FEED_DEFAULT_DAYS } from "@/components/fingerprints/fetch-by-features";

export const metadata: Metadata = {
	title: "Fingerprints",
};

type Props = {
	searchParams?: {
		ids?: string;
		days?: string;
		weights?: string; // weights=c:0.5,t:1.1,k:0.9
	};
};

export default async function FingerprintsPage({ searchParams }: Props) {
	const params = {
		ids: searchParams?.ids?.length ? searchParams.ids : undefined,
		days: searchParams?.days
			? Number.parseInt(searchParams.days)
			: FEED_DEFAULT_DAYS,
	};

	const ids = params.ids?.split(",") ?? [];

	// Only use history when `ids` param is missing (accept clearing the list of papers)
	const noIds = searchParams?.ids === undefined;
	if (noIds && !ids.length) {
		const history = await getHistory();
		if (history.length) {
			redirect(`/discover/fingerprints?ids=${history.join(",")}`);
		}
	}

	const fingerprints = await fetchFingerprints(ids);
	const { allFeatures, filter } = getFeatureFilter(
		fingerprints,
		searchParams?.weights,
	);

	return (
		<div className="space-y-6">
			<Feed filter={{ features: filter, days: params.days }} debug>
				<AutocompleteInput />
				<FeatureCloud features={allFeatures} />
			</Feed>
		</div>
	);
}
