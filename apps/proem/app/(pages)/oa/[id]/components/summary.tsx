import { OpenAlexPaper } from "@proemial/models/open-alex";
import { Redis } from "@proemial/redis/redis";
import Markdown from "./markdown";
import { summarise } from "@/app/prompts/summariser";

export default async function Summary({ paper }: { paper: OpenAlexPaper }) {
  const paperTitle = paper?.data?.title;
  const abstract = paper?.data?.abstract;
  const generatedTitle = paper?.generated?.title;

  if (!generatedTitle && paperTitle && abstract) {
    const title = (await summarise(paperTitle, abstract)) as string;

    await Redis.papers.upsert(paper.id, (existingPaper) => {
      const generated = existingPaper.generated
        ? { ...existingPaper.generated, title }
        : { title };

      return {
        ...existingPaper,
        generated,
      };
    });

    console.log("response", title);
    return <Markdown>{title as string}</Markdown>;
  }

  return <Markdown>{generatedTitle as string}</Markdown>;
}
