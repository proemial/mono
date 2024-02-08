import { Suspense } from "react";
import { CenteredSpinner, NothingHere } from "@/app/components/spinner";
import { ClickablePaperCard } from "@/app/components/card/clickable-card";
import { PaperCard } from "@/app/components/card/paper-card";

export function CardList({ ids }: { ids: string[] }) {
  if (ids.length === 0) {
    return <NothingHere>No papers found</NothingHere>;
  }

  return (
    <div className="max-w-screen-sm pb-20 mx-auto flex flex-col justify-begin">
      {ids.map((paper, index) => (
        <Suspense key={index} fallback={<CenteredSpinner />}>
          <ClickablePaperCard id={paper}>
            <PaperCard id={paper} />
          </ClickablePaperCard>
        </Suspense>
      ))}
    </div>
  );
}
