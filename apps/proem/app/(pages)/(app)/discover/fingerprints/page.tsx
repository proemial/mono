import { Feed } from "@/app/(pages)/(app)/discover/feed";
import { Autocomplete } from "./autocomplete";
import { fetchPaperFeatures } from "./fetch-papers";
import { getFingerprintFilter } from "./fingerprint";

type Props = {
	searchParams?: {
		ids?: string;
	};
};

export default async function FiltersPage({ searchParams }: Props) {
	const idParam = searchParams?.ids?.length ? searchParams.ids : undefined;
	const ids = idParam?.split(",") ?? [];

	const paperFeatures = await fetchPaperFeatures(ids);
	const fingerprint = getFingerprintFilter(paperFeatures);

	return (
		<div className="space-y-6">
			<Feed filter={fingerprint.filter}>
				<Autocomplete />
			</Feed>
		</div>
	);
}
