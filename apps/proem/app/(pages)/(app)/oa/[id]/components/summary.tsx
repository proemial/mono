import { Redis } from "@proemial/redis/redis";
import Markdown from "./markdown";
import { summarise } from "@/app/prompts/summariser";
import { fetchPaper } from "@/app/(pages)/(app)/oa/[id]/fetch-paper";

export default async function Summary({ id }: { id: string }) {
  const paper = await fetchPaper(id);

  const paperTitle = paper?.data?.title;
  const abstract = paper?.data?.abstract;
  const generatedTitle = paper?.generated?.title;

  if (!generatedTitle && paperTitle && abstract) {
    const title = (await summarise(paperTitle, abstract)) as string;

    console.log("[summary] Upsert", paper.id);
    await Redis.papers.upsert(paper.id, (existingPaper) => {
      const generated = existingPaper.generated
        ? { ...existingPaper.generated, title }
        : { title };

      return {
        ...existingPaper,
        generated,
      };
    });

    return <Markdown>{title as string}</Markdown>;
  }

  return <Markdown>{generatedTitle as string}</Markdown>;
}
