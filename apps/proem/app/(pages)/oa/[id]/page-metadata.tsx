import { fetchPaper } from "@/app/(pages)/oa/[id]/fetch-paper";
import { Redis } from "@proemial/redis/redis";

export async function getDescription(id: string, title?: string) {
  console.log("getDescription");
  if (title) {
    await Redis.papers.upsert(id, title);

    return title;
  }

  const paper = await fetchPaper(id);
  return paper?.generated?.title ? paper.generated.title : paper?.data?.title;
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
