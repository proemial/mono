import { fetchFingerprints } from "../../../../../components/fingerprints/fetch-fingerprints";
import { getFeatureFilter } from "../../../../../components/fingerprints/features";
import { FeatureCloud } from "../../../../../components/fingerprints/feature-cloud";
import { AutocompleteInput } from "./autocomplete-input";
import { PaperFeed } from "./paper-feed";
import { getHistory } from "./fetch-history";
import { redirect } from "next/navigation";

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
	console.log("ids", ids);

	if (!ids.length) {
		const history = await getHistory();
		if (history.length) {
			redirect(
				`/discover/fingerprints?ids=${history.map((h) => h.paperId).join(",")}`,
			);
		}
	}

	const fingerprints = await fetchFingerprints(ids);
	const { features, filter } = getFeatureFilter(fingerprints);

	return (
		<div className="space-y-6">
			<>
				<AutocompleteInput />
				<FeatureCloud features={features} />
			</>
			<PaperFeed filter={filter} days={params.days} />
		</div>
	);
}
