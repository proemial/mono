import { Suspense } from "react";
import { CenteredSpinner, NothingHere } from "@/app/components/spinner";
import { ClickablePaperCard } from "@/app/components/card/clickable-card";
import { FeedPaper } from "@/app/components/card/feed-paper";

export function CardList({
  ids,
  mainConcept,
}: {
  ids: string[];
  mainConcept?: string;
}) {
  if (ids.length === 0) {
    return <NothingHere>No papers found</NothingHere>;
  }

  return (
    <div className="flex flex-col max-w-screen-sm pb-20 mx-auto justify-begin">
      {ids.map((paper, index) => (
        <Suspense key={index} fallback={<CenteredSpinner />}>
          <ClickablePaperCard id={paper}>
            <FeedPaper id={paper} mainConcept={mainConcept} />
          </ClickablePaperCard>
        </Suspense>
      ))}
    </div>
  );
}
