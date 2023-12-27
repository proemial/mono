import * as metadata from "@/app/(pages)/oa/[id]/page-metadata";
import { fetchPaper } from "@/app/(pages)/oa/[id]/fetch-paper";

type Props = {
  params: { id: string };
  searchParams: { title?: string };
};

export async function generateMetadata({ params: p, searchParams: s }: Props) {
  console.log("generateMetadata");
  const description = await metadata.getDescription(p.id, s.title);

  return metadata.formatMetadata(p.id, description);
}

export default async function ReaderPage({ params, searchParams }: Props) {
  console.log("ReaderPage");
  let titleFromParams = searchParams.title || "";
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
