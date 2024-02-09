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

export async function FeedPaper({ id }: { id: string }) {
  const paper = await fetchPaper(id);

  if (!paper) {
    return;
  }

  const data = paper.data as OpenAlexWorkMetadata;

  return (
    <PaperCard>
      <PaperCardTop date={paper.data.publication_date} />

      <PaperCardTitle>
        <Suspense fallback={<Spinner />}>
          <Summary paper={paper} />
        </Suspense>
      </PaperCardTitle>

      <div className="text-xs text-white/50">
        {data.topics?.length && data.topics.at(0)?.display_name}
      </div>
    </PaperCard>
  );
}
