import { fetchFingerprints } from "@/components/fingerprints/fetch-fingerprints";
import { getFeatureFilter } from "@/components/fingerprints/features";
import { FeatureCloud } from "@/components/fingerprints/feature-cloud";
import { AutocompleteInput } from "./autocomplete-input";
import { getHistory } from "@/components/fingerprints/fetch-history";
import { redirect } from "next/navigation";
import { getInternalUser } from "@/app/hooks/get-internal-user";
import { Feed } from "../feed";

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

	const internal = getInternalUser();
	console.log("internal", internal);

	// Only use history when `ids` param is missing (accept clearing the list of papers)
	const noIds = searchParams?.ids === undefined;
	if (noIds && !ids.length) {
		const history = await getHistory();
		if (history.length) {
			redirect(`/discover/fingerprints?ids=${history.join(",")}`);
		}
	}

	const fingerprints = await fetchFingerprints(ids);
	const { features, filter } = getFeatureFilter(fingerprints);

	return (
		<div className="space-y-6">
			<Feed filter={{ features: filter, days: params.days }} debug>
				<AutocompleteInput />
				<FeatureCloud features={features} />
			</Feed>
		</div>
	);
}
