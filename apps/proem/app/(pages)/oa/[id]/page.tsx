import * as metadata from "./page-metadata";
import { fetchPaper } from "./fetch-paper";
import Summary from "./components/summary";
import { Suspense } from "react";
import { OpenAlexPaper } from "@proemial/models/open-alex";
import { PaperCard } from "./components/paper-card";

type Props = {
  params: { id: string };
  searchParams: { title?: string };
};

export async function generateMetadata({ params: p, searchParams: s }: Props) {
  const description = await metadata.getDescription(p.id, s.title);

  return metadata.formatMetadata(p.id, description);
}

export default async function ReaderPage({ params, searchParams }: Props) {
  let titleFromParams = searchParams.title || "";
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
        <Suspense fallback={<SummaryFallback paper={paper} />}>
          <Summary paper={paper} />
        </Suspense>
      </PaperCard>
    </main>
  );
}

function SummaryFallback({ paper }: { paper?: OpenAlexPaper }) {
  return <div>Paper title: {paper?.generated?.title}</div>;
}
