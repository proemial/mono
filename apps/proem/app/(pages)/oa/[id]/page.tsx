import * as metadata from "@/app/(pages)/oa/[id]/page-metadata";
import { fetchPaper } from "@/app/(pages)/oa/[id]/fetch-paper";

type Props = {
  params: { id: string };
  searchParams: { text?: string; title?: string };
};

export async function generateMetadata({ params, searchParams }: Props) {
  const description = await metadata.getDescription(params.id, searchParams);
  return metadata.formatMetadata(params.id, description);
}

export default async function ReaderPage({ params, searchParams }: Props) {
  let titleFromParams = searchParams.text || searchParams.title || "";
  const paper = await fetchPaper(params.id);

  return (
    <div>
      <div>id: {params.id}</div>
      <div>title: {paper?.data?.title || titleFromParams}</div>
      <div>microtitle: {paper?.generated?.title}</div>
      <div>abstract: {paper?.data?.abstract}</div>
      <div>microabstract: {paper?.generated?.abstract}</div>
    </div>
  );
}
