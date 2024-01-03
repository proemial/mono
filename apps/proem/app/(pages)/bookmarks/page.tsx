import { Suspense } from "react";
import {
  CenteredSpinner,
  EmptySpinner,
  NothingHereYet,
} from "@/app/components/spinner";
import { PaperCard } from "@/app/components/card/card";

export const revalidate = 1;

export default async function HistoryPage() {
  return (
    <main className="flex min-h-screen flex-col justify-begin">
      <div className="text-xl px-4 py-6 bg-background h-full top-0 sticky shadow">
        Bookmarks
      </div>
      <Suspense fallback={<CenteredSpinner />}>
        <PageContent />
      </Suspense>
    </main>
  );
}

async function PageContent() {
  // TODO: Fetch bookmarked pages
  const latestIds = ["W10438119", "W125463860", "W2180080828"];

  return (
    <>
      {latestIds.length === 0 && <NothingHereYet />}
      {latestIds.map((id, index) => (
        <Suspense key={index} fallback={<EmptySpinner />}>
          <PaperCard id={id} />
        </Suspense>
      ))}
    </>
  );
}
