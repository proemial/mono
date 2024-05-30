import { fetchPaperFeatures } from "./fetch-papers";
import { getFingerprints } from "./fingerprint";
import { FingerprintCloud } from "./filter-profile";
import { AutocompleteInput } from "./autocomplete";
import { Feed } from "./feed";

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
			<Feed filter={profile.query} profile={profile.fingerprints}>
				<>
					<AutocompleteInput />
					<FingerprintCloud fingerprints={profile.fingerprints} />
				</>
			</Feed>
		</div>
	);
}
