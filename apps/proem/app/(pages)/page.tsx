import { PaperCard } from "@/app/components/card/card";
import {
  CenteredSpinner,
  EmptySpinner,
  NothingHereYet,
} from "@/app/components/spinner";
import { Suspense } from "react";
import { fetchLatestPaperIds } from "./oa/[id]/fetch-paper";

export const revalidate = 1;

export default async function FrontPage() {
  const latestIds = await fetchLatestPaperIds()

  return (
    <div className="flex flex-col max-w-screen-sm min-h-full mx-auto justify-begin">
      <Suspense fallback={<CenteredSpinner />}>
        <PageContent latestIds={latestIds} />
      </Suspense>
    </div>
  );
}

async function PageContent({ latestIds }: { latestIds: string[] }) {
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
