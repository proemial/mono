import { ActionsMenu } from "@/app/(pages)/oa/[id]/components/menu/actions-menu";
import { MetadataPanel } from "@/app/(pages)/oa/[id]/components/panels/metadata";
import { QuestionsPanel } from "@/app/(pages)/oa/[id]/components/panels/questions";
import { Spinner } from "@/app/components/spinner";
import { Suspense } from "react";
import { PaperCard } from "./components/paper-card";
import Summary from "./components/summary";
import { fetchPaper } from "./fetch-paper";
import * as metadata from "./page-metadata";

type Props = {
  params: { id: string };
  searchParams: { title?: string };
};

export async function generateMetadata({ params: p, searchParams: s }: Props) {
  const description = await metadata.getDescription(p.id, s.title);

  return metadata.formatMetadata(p.id, description);
}

export default async function ReaderPage({ params }: Props) {
  const paper = await fetchPaper(params.id);

  return (
    <>
      <PaperCard
        id={params.id}
        date={paper.data.publication_date}
        organisation={
          paper.data.primary_location?.source?.host_organization_name
        }
      >
        <Suspense fallback={<Spinner />}>
          <Summary paper={paper} />
        </Suspense>
      </PaperCard>

      {/* ↓↓↓ "Read the full article" & "Copy to clipboard" ↓↓↓ */}

      {/* <ActionsMenu
        id={params.id}
        url={paper.data.primary_location?.landing_page_url}
        className="z-50 p-4 bg-background"
      /> */}

      <div className="flex flex-col gap-6 px-6 py-3 text-base">
        <Suspense fallback={<Spinner />}>
          <QuestionsPanel paper={paper} />
        </Suspense>
      </div>
    </>
  );
}
