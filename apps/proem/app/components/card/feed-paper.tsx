import Summary from "@/app/(pages)/(app)/oa/[id]/components/summary";
import {
  PaperCard,
  PaperCardTitle,
  PaperCardTop,
} from "@/app/components/card/paper-card";
import { Spinner } from "@/app/components/spinner";
import {
  OpenAlexPaper,
  OpenAlexWorkMetadata,
} from "@proemial/models/open-alex";
import { Suspense } from "react";
import { getFeatureFlags } from "@/app/components/feature-flags/server-flags";
import { Features } from "@/app/components/feature-flags/features";
import { CardFooter } from "@/app/components/card/footer";

export async function FeedPaper({ paper }: { paper?: OpenAlexPaper }) {
  if (!paper) {
    return;
  }

  const flags = await getFeatureFlags([
    Features.showMainTopicInCards,
    Features.showSubfieldInCards,
    Features.hideConceptsInCards,
    Features.showJournalInCards,
    Features.showOrgInCards,
  ]);

  return (
    <PaperCard>
      <PaperCardTop date={paper.data.publication_date} />

      <PaperCardTitle>
        <Suspense fallback={<Spinner />}>
          <Summary paper={paper} />
        </Suspense>
      </PaperCardTitle>

      <div className="font-sourceCodePro">
        <CardFooter data={paper.data as OpenAlexWorkMetadata} flags={flags} />
      </div>
    </PaperCard>
  );
}
