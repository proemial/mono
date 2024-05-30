import { fetchPaperFeatures } from "./fetch-papers";
import { getFingerprints } from "./fingerprint";
import { FingerprintCloud } from "./gingerprint-cloud";
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
	const profile = getFingerprints(paperFeatures);

	return (
		<div className="space-y-6">
			<PaperFeed filter={profile.query} profile={profile.fingerprints}>
				<>
					<AutocompleteInput />
					<FingerprintCloud fingerprints={profile.fingerprints} />
				</>
			</PaperFeed>
		</div>
	);
}
