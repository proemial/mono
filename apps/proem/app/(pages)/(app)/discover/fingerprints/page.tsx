import { fetchFingerprints } from "@proemial/repositories/oa/fingerprinting/fetch-fingerprints";
import { getFeatureFilter } from "@proemial/repositories/oa/fingerprinting/features";
import { FeatureCloud } from "@/components/fingerprints/feature-cloud";
import { AutocompleteInput } from "./autocomplete-input";
import { redirect } from "next/navigation";
import { Feed } from "../feed";
import { Metadata } from "next";
import { FEED_DEFAULT_DAYS } from "@/app/data/fetch-by-features";
import { getHistory } from "@/app/data/fetch-history";

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
