import { PaperCard } from "@/app/components/card/card";
import { PageHeader } from "@/app/components/page-header";
import {
  CenteredSpinner,
  EmptySpinner,
  NothingHereYet,
} from "@/app/components/spinner";
import { Suspense } from "react";

export const revalidate = 1;

export default async function HistoryPage() {
  return (
    <div className="flex flex-col justify-begin">
      <Suspense fallback={<CenteredSpinner />}>
        <PageContent />
      </Suspense>
    </div>
  );
}

async function PageContent() {
  // TODO: Fetch history
  const latestIds = ["W10438119", "W125463860", "W2180080828", "W1971798103"];

  return (
    <div className="p-6">
      {latestIds.length === 0 && <NothingHereYet />}
      {latestIds.map((id, index) => (
        <Suspense key={index} fallback={<EmptySpinner />}>
          <PaperCard id={id} />
        </Suspense>
      ))}
    </div>
  );
}
