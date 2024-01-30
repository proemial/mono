import { fetchPaper } from "@/app/(pages)/(app)/oa/[id]/fetch-paper";
import { Redis } from "@proemial/redis/redis";
import { headers } from "next/headers";

export async function getDescription(id: string, title?: string) {
  if (title) {
    await Redis.papers.upsert(id, (existingPaper) => {
      const generated = existingPaper.generated
        ? { ...existingPaper.generated, title }
        : { title };

      return {
        ...existingPaper,
        generated,
        id,
      };
    });

    return title;
  }

  const paper = await fetchPaper(id);
  return paper?.generated?.title ? paper.generated.title : paper?.data?.title;
}

export function formatMetadata(id: string, description?: string) {
  const requestHeaders = headers();
  const host = requestHeaders.get("host");

  const title = `${description}`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: [
        {
          url: `https://${host}/api/og/${id}?text=${description}`,
          width: 400,
          height: 200,
          alt: description,
        },
      ],
    },
  };
}
