import { PaperCard } from "@/app/components/card/card";
import { PageHeader } from "@/app/components/page-header";
import {
  CenteredSpinner,
  EmptySpinner,
  NothingHereYet,
} from "@/app/components/spinner";
import { Suspense } from "react";

export const revalidate = 1;

export default async function FrontPage() {
  return (
    <div className="flex flex-col max-w-screen-md min-h-full mx-auto justify-begin">
      <PageHeader>Proem</PageHeader>
      <Suspense fallback={<CenteredSpinner />}>
        <PageContent />
      </Suspense>
    </div>
  );
}

async function PageContent() {
  // TODO: Fetch history
  const latestIds = [
    "W10438119",
    "W125463860",
    "W2180080828",
    "W1971798103",
    "W1971798103",
    "W2180080828",
  ];

  return (
    <div className="flex flex-col p-6 md:grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 md:gap-4">
      {latestIds.length === 0 && <NothingHereYet />}
      {latestIds.map((id, index) => (
        <Suspense key={index} fallback={<EmptySpinner />}>
          <PaperCard id={id} />
        </Suspense>
      ))}
    </div>
  );
}
