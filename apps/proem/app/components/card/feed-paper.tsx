import { CardFooter } from "@/app/components/card/footer";
import {
	PaperCard,
	PaperCardTitle,
	PaperCardTop,
} from "@/app/components/card/paper-card";
import { Spinner } from "@/app/components/loading/spinner";
import Summary from "@/old/(pages)/(app)/oa/[id]/components/summary";
import {
	OpenAlexPaper,
	OpenAlexWorkMetadata,
} from "@proemial/models/open-alex";
import { Suspense } from "react";
import { getFeatureFlags } from "../feature-flags/server-flags";

export async function FeedPaper({ paper }: { paper?: OpenAlexPaper }) {
	if (!paper) {
		return;
	}

	const flags = await getFeatureFlags(["cardShowShortenedTopics"]);

	return (
		<PaperCard>
			<PaperCardTop date={paper.data.publication_date} />

			<PaperCardTitle>
				<Suspense fallback={<Spinner />}>
					<Summary id={paper.id} />
				</Suspense>
			</PaperCardTitle>

			<div className="font-sourceCodePro">
				<CardFooter data={paper.data as OpenAlexWorkMetadata} flags={flags} />
			</div>
		</PaperCard>
	);
}
