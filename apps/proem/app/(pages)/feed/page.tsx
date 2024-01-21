import { fetchLatestPaperIds } from "@/app/(pages)/oa/[id]/fetch-paper";
import { PaperCard } from "@/app/components/card/card";
import {
  CenteredSpinner,
  EmptySpinner,
  NothingHereYet,
} from "@/app/components/spinner";
import { Suspense } from "react";

export const revalidate = 1;

export default async function FrontPage() {
  const latestIds = await fetchLatestPaperIds();

  return (
    <div className="flex flex-col max-w-screen-sm pb-20 mx-auto justify-begin">
      <Suspense fallback={<CenteredSpinner />}>
        <PageContent latestIds={latestIds} />
      </Suspense>
    </div>
  );
}

async function PageContent({ latestIds }: { latestIds: string[] }) {
  return (
    <div className="p-4">
      {latestIds.length === 0 && <NothingHereYet />}
      {latestIds.map((id, index) => (
        <Suspense key={index} fallback={<EmptySpinner />}>
          <PaperCard id={id} />
        </Suspense>
      ))}
    </div>
  );
}
