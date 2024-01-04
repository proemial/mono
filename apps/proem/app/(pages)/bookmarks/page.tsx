import { Suspense } from "react";
import {
  CenteredSpinner,
  EmptySpinner,
  NothingHereYet,
} from "@/app/components/spinner";
import { PaperCard } from "@/app/components/card/card";
import { PageHeader } from "../../components/page-header";

export const revalidate = 1;

export default async function BookmarksPage() {
  return (
    <div className="flex flex-col min-h-screen justify-begin">
      <PageHeader>Bookmarks</PageHeader>
      <Suspense fallback={<CenteredSpinner />}>
        <PageContent />
      </Suspense>
    </div>
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
