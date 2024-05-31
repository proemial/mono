import { fetchFingerprints } from "./helpers/fetch-papers";
import { getRankedFeatures } from "./helpers/fingerprint";
import { RankedFeatureCloud } from "./feature-cloud";
import { AutocompleteInput } from "./autocomplete-input";
import { PaperFeed } from "./paper-feed";

type Props = {
	searchParams?: {
		ids?: string;
	};
};

export default async function FingerprintsPage({ searchParams }: Props) {
	const idParam = searchParams?.ids?.length ? searchParams.ids : undefined;
	const ids = idParam?.split(",") ?? [];

	const fingerprints = await fetchFingerprints(ids);
	const rankedFeatures = getRankedFeatures(fingerprints);

	return (
		<div className="space-y-6">
			<PaperFeed rankedFeatures={rankedFeatures}>
				<>
					<AutocompleteInput />
					<RankedFeatureCloud rankedFeatures={rankedFeatures} />
				</>
			</PaperFeed>
		</div>
	);
}
