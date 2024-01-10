import { PaperCard } from "@/app/components/card/card";
import {
  CenteredSpinner,
  EmptySpinner,
  NothingHereYet,
} from "@/app/components/spinner";
import { Suspense } from "react";

export const revalidate = 1;

export default async function FrontPage() {
  return (
    <div className="flex flex-col max-w-screen-sm min-h-full mx-auto justify-begin">
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
    "W2063436182",
    "W2009065480",
    "W2109166831",
    "W1972268296",
    "W2159667899",
    "W2025926911",
    "W1938528378",
    "W2028329146",
    "W1971798103",
    "W1963581370",
    "W2159874741",
    "W2133059852",
    "W2221567553",
    "W2094187658",
    "W2980759431",
    "W2060152915",
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
