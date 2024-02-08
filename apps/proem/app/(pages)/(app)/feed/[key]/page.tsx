import { fetchLatestPaperIds } from "@/app/(pages)/(app)/oa/[id]/fetch-paper";
import { CardList } from "@/app/components/card/card-list";
import { CenteredSpinner } from "@/app/components/spinner";
import { Suspense } from "react";
import { OaConcepts } from "@proemial/models/open-alex-concepts";

export const revalidate = 1;

type Props = {
  params: { key: string };
};

export default async function FrontPage({ params }: Props) {
  const conceptId = OaConcepts.find(
    (c) => c.display_name === decodeURI(params.key),
  )?.id;

  const latestIds = await fetchLatestPaperIds(conceptId);

  return (
    <div>
      <Suspense fallback={<CenteredSpinner />}>
        <CardList ids={latestIds} />
      </Suspense>
    </div>
  );
}
