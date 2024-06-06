import { fetchFingerprints } from "../../../../../components/fingerprints/fetch-fingerprints";
import { getFeatureFilter } from "../../../../../components/fingerprints/features";
import { FeatureCloud } from "../../../../../components/fingerprints/feature-cloud";
import { AutocompleteInput } from "./autocomplete-input";
import { PaperFeed } from "./paper-feed";
import { auth } from "@clerk/nextjs/server";
import { neonDb } from "@proemial/data";
import { eq } from "drizzle-orm";
import { users } from "@proemial/data/neon/schema";

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

	if (ids.length === 0) {
		const { userId } = auth();
		if (userId) {
			const user = await neonDb.query.users.findFirst({
				where: eq(users.id, userId),
			});
			const papers = user?.paperActivities.slice(0, 10);

			if (papers) {
				for (const paper of papers) {
					ids.push(paper.paperId);
				}
			}
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
