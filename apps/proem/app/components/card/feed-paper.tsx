import Summary from "@/app/(pages)/(app)/oa/[id]/components/summary";
import { fetchPaper } from "@/app/(pages)/(app)/oa/[id]/fetch-paper";
import { Concepts } from "@/app/components/card/concepts";
import {
  PaperCard,
  PaperCardTitle,
  PaperCardTop,
} from "@/app/components/card/paper-card";
import { Spinner } from "@/app/components/spinner";
import { OpenAlexWorkMetadata } from "@proemial/models/open-alex";
import { ReactNode, Suspense } from "react";

export async function FeedPaper({
  id,
  asTags,
}: {
  id: string;
  mainConcept?: string;
  asTags?: boolean;
  children?: ReactNode;
}) {
  const paper = await fetchPaper(id);

  if (!paper) {
    return;
  }

  return (
    // <div className="bg-[#1A1A1A] border border-t-0 border-x-0 border-[#4E4E4E] scale-100 active:scale-[0.99] transition-all duration-100">
    //   <div className="flex flex-col justify-between h-full px-4 pt-2 pb-4 text-lg font-medium items-left">
    <PaperCard>
      <PaperCardTop date={paper.data.publication_date} />

      <PaperCardTitle>
        <Suspense fallback={<Spinner />}>
          <Summary paper={paper} />
        </Suspense>
      </PaperCardTitle>

      <Concepts data={paper.data as OpenAlexWorkMetadata} asTags={asTags} />
    </PaperCard>
    //   </div>
    // </div>
  );
}
