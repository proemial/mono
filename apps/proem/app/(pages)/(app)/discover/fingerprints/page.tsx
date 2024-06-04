import { fetchFingerprints } from "./helpers/fetch-papers";
import { filterByFingerprints } from "./helpers/fingerprint";
import { RankedFeatureCloud } from "./feature-cloud";
import { AutocompleteInput } from "./autocomplete-input";
import { PaperFeed } from "./paper-feed";

type Props = {
	searchParams?: {
		ids?: string;
		days?: string;
	};
};

export default async function FingerprintsPage({ searchParams }: Props) {
	const params = {
		ids: searchParams?.ids?.length ? searchParams.ids : undefined,
		days: searchParams?.days ? Number.parseInt(searchParams.days) : 14,
	};

	const ids = params.ids?.split(",") ?? [];

	const fingerprints = await fetchFingerprints(ids);
	const { features, filter } = filterByFingerprints(fingerprints);

	return (
		<div className="space-y-6">
			<>
				<AutocompleteInput />
				<RankedFeatureCloud features={features} />
			</>
			<PaperFeed filter={filter} days={params.days} />
		</div>
	);
}
