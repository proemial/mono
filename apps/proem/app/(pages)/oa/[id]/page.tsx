import * as metadata from "@/app/(pages)/oa/[id]/page-metadata";
import { fetchPaper } from "@/app/(pages)/oa/[id]/fetch-paper";
import Summary from "./components/summary";
import { Suspense } from "react";
import { OpenAlexPaper } from "@proemial/models/open-alex";

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
    <div>
      <div>id: {params.id}</div>
      <Suspense fallback={<SummaryFallback paper={paper} />}>
        <Summary paper={paper} />
      </Suspense>
      <div>
        Authors:
        {paper?.data?.authorships?.map((author, i) => (
          <div key={i}>author: {author.author.display_name}</div>
        ))}
      </div>
    </div>
  );
}

function SummaryFallback({ paper }: { paper?: OpenAlexPaper }) {
  return <div>Paper title: {paper?.generated?.title}</div>;
}
