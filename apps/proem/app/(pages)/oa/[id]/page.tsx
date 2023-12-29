import * as metadata from "./page-metadata";
import { fetchPaper } from "./fetch-paper";
import Summary from "./components/summary";
import { Suspense } from "react";
import { OpenAlexPaper } from "@proemial/models/open-alex";
import { PaperCard } from "./components/paper-card";
import { ActionsMenu } from "@/app/(pages)/oa/[id]/components/menu/actions-menu";
import { MetadataPanel } from "@/app/(pages)/oa/[id]/components/panels/metadata";
import { QuestionsPanel } from "@/app/(pages)/oa/[id]/components/panels/questions";
import { Spinner } from "@/app/components/spinner";

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
    <main className="flex min-h-screen flex-col justify-start">
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

      <ActionsMenu
        id={params.id}
        url={paper.data.primary_location?.landing_page_url}
        className="p-4 top-0 sticky bg-background z-50"
      />

      <div className="px-4 pt-2">
        <div className="flex flex-col gap-6 text-base">
          <MetadataPanel paper={paper} closed />
          <Suspense fallback={<Spinner />}>
            <QuestionsPanel paper={paper} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
