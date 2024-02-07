import { Suspense } from "react";
import { CenteredSpinner, NothingHere } from "@/app/components/spinner";
import { PaperCard } from "@/app/components/card/card";
import { CardContent } from "@/app/components/card/card-content";

export function CardList({ ids }: { ids: string[] }) {
  if (ids.length === 0) {
    return <NothingHere>No papers found</NothingHere>;
  }

  return (
    <div className="flex flex-col max-w-screen-sm pt-4 pb-20 mx-auto justify-begin">
      {ids.map((id, index) => (
        <Suspense key={index} fallback={<CenteredSpinner />}>
          <PaperCard id={id}>
            <CardContent id={id} />
          </PaperCard>
        </Suspense>
      ))}
    </div>
  );
}
