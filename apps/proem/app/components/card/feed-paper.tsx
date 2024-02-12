import Summary from "@/app/(pages)/(app)/oa/[id]/components/summary";
import { fetchPaper } from "@/app/(pages)/(app)/oa/[id]/fetch-paper";
import {
  PaperCard,
  PaperCardTitle,
  PaperCardTop,
} from "@/app/components/card/paper-card";
import { Spinner } from "@/app/components/spinner";
import { OpenAlexWorkMetadata } from "@proemial/models/open-alex";
import { Suspense } from "react";
import { getFeatureFlags } from "@/app/components/feature-flags/server-flags";
import { Features } from "@/app/components/feature-flags/features";
import { Concepts } from "@/app/components/card/concepts";

export async function FeedPaper({ id }: { id: string }) {
  const paper = await fetchPaper(id);

  if (!paper) {
    return;
  }

  const data = paper.data as OpenAlexWorkMetadata;

  const flags = await getFeatureFlags([
    Features.showMainTopicInCards,
    Features.showSubfieldInCards,
    Features.hideConceptsInCards,
    Features.showJournalInCards,
    Features.showOrgInCards,
  ]);
  console.log("flags", flags);

  return (
    <PaperCard>
      <PaperCardTop date={paper.data.publication_date} />

      <PaperCardTitle>
        <Suspense fallback={<Spinner />}>
          <Summary paper={paper} />
        </Suspense>
      </PaperCardTitle>

      <div className="font-sourceCodePro">
        {flags.showMainTopicInCards && (
          <div className="text-xs text-white/50">
            {data.topics?.length && data.topics.at(0)?.display_name}
          </div>
        )}
        {flags.showSubfieldInCards && (
          <div className="text-xs text-white/50">
            {data.topics?.length && data.topics.at(0)?.subfield?.display_name}
          </div>
        )}
        {flags.showOrgInCards && (
          <div className="text-xs text-white/50">
            {data?.primary_location?.source?.host_organization_name}
          </div>
        )}
        {flags.showJournalInCards && (
          <div className="text-xs text-white/50">
            {data?.primary_location?.source?.display_name}
          </div>
        )}
        {!flags.hideConceptsInCards && (
          <Concepts data={paper.data as OpenAlexWorkMetadata} />
        )}
      </div>
    </PaperCard>
  );
}
