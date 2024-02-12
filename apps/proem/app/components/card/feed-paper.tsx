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

  //  TODO: use enum keys instead of values
  const {
    CARD_FOOTER_HIDE_MAIN_TOPIC,
    CARD_FOOTER_SHOW_SUBFIELD,
    CARD_FOOTER_SHOW_CONCEPTS,
    CARD_FOOTER_SHOW_JOURNAL,
    CARD_FOOTER_SHOW_ORG,
  } = await getFeatureFlags([
    Features.hideMainTopicInCards,
    Features.showSubfieldInCards,
    Features.showConceptsInCards,
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
        {!CARD_FOOTER_HIDE_MAIN_TOPIC && (
          <div className="text-xs text-white/50">
            {data.topics?.length && data.topics.at(0)?.display_name}
          </div>
        )}
        {CARD_FOOTER_SHOW_SUBFIELD && (
          <div className="text-xs text-white/50">
            {data.topics?.length && data.topics.at(0)?.subfield?.display_name}
          </div>
        )}
        {CARD_FOOTER_SHOW_ORG && (
          <div className="text-xs text-white/50">
            {data?.primary_location?.source?.host_organization_name}
          </div>
        )}
        {CARD_FOOTER_SHOW_JOURNAL && (
          <div className="text-xs text-white/50">
            {data?.primary_location?.source?.display_name}
          </div>
        )}
        {CARD_FOOTER_SHOW_CONCEPTS && (
          <Concepts data={paper.data as OpenAlexWorkMetadata} />
        )}
      </div>
    </PaperCard>
  );
}
