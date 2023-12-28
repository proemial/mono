import OpenAI from "openai";
import { OpenAlexPaper } from "@proemial/models/open-alex";
import { Redis } from "@proemial/redis/redis";
import { Env } from "@proemial/utils/env";
import Markdown from "./markdown";

export default async function Summary({ paper }: { paper: OpenAlexPaper }) {
  const title = paper?.data?.title;
  const abstract = paper?.data?.abstract;
  const generatedTitle = paper?.generated?.title;

  if (!generatedTitle && title && abstract) {
    const response = await summarise(title, abstract);

    await Redis.papers.upsert(paper.id, (existingPaper) => {
      const generated = existingPaper.generated
        ? { ...existingPaper.generated, title }
        : { title };

      return {
        ...existingPaper,
        generated,
      };
    });

    return <Markdown>{response as string}</Markdown>;
  }

  return <Markdown>{paper?.generated?.title as string}</Markdown>;
}

async function summarise(title: string, abstract: string) {
  const openai = new OpenAI({
    apiKey: Env.get("OPENAI_API_KEY"),
  });

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "assistant",
        content:
          "You are a helpful assistant who can explain scientific concepts in terms that allow researchers from one scientific domain to grasp and be inspired by ideas from another domain.",
      },
      {
        role: "system",
        content: `Analyse the following scientific article with title: \"${title}\" and abstract: \"${abstract}\"`,
      },
      {
        role: "user",
        content:
          'Write a captivating summary in 20 words or less of the most significant finding for an engaging tweet that will capture the minds of other researchers, using layman\'s terminology, and without mentioning abstract entities like "you", "researchers", "authors", "propose", or "study" but rather stating the finding as a statement of fact. Make sure to use 20 words or less.',
      },
    ],
  });
  return completion.choices[0]?.message.content;
}
