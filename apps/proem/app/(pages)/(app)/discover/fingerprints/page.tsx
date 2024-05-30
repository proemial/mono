import { fetchPaperFeatures } from "./helpers/fetch-papers";
import { getFingerprints } from "./helpers/fingerprint";
import { FingerprintCloud } from "./fingerprint-cloud";
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

	const paperFeatures = await fetchPaperFeatures(ids);
	const fingerprints = getFingerprints(paperFeatures);

	return (
		<div className="space-y-6">
			<PaperFeed fingerprints={fingerprints}>
				<>
					<AutocompleteInput />
					<FingerprintCloud fingerprints={fingerprints} />
				</>
			</PaperFeed>
		</div>
	);
}
