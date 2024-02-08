import { fetchLatestPaperIds } from "@/app/(pages)/(app)/oa/[id]/fetch-paper";
import { CardList } from "@/app/components/card/card-list";
import { CenteredSpinner } from "@/app/components/spinner";
import { Suspense } from "react";

export const revalidate = 1;

export default async function FrontPage() {
  const latestIds = await fetchLatestPaperIds();

  return (
    <div>
      <Suspense fallback={<CenteredSpinner />}>
        <CardList ids={latestIds} />
      </Suspense>
    </div>
  );
}
