import { fetchPaper } from "@/app/(pages)/oa/[id]/fetch-paper";

export async function getDescription(
  id: string,
  searchParams: { text?: string; title?: string },
) {
  let description = searchParams.text || searchParams.title;
  if (!description) {
    const paper = await fetchPaper(id);
    if (paper?.generated?.title) {
      description = paper.generated.title;
    } else {
      description = paper?.data?.title;
    }
  }
  return description;
}

export function formatMetadata(id: string, description?: string) {
  const title = `Proem - ${id}`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: [
        {
          url: `https://proem.ai/api/og/${id}?text=${description}`,
          width: 400,
          height: 200,
          alt: description,
        },
      ],
    },
  };
}
