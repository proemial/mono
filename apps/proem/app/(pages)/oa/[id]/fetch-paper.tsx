import { cache } from "react";
import { Redis } from "@proemial/redis/redis";
import {
  baseOaUrl,
  openAlexFields,
  OpenAlexPaper,
  OpenAlexWorkMetadata,
} from "@proemial/models/open-alex";
import { fromInvertedIndex } from "@proemial/utils/string";

export const fetchPaper = cache(async (id: string): Promise<OpenAlexPaper> => {
  console.log("fetchPaper");
  const paper = await Redis.papers.get(id);

  if (!(paper?.data as OpenAlexWorkMetadata)?.doi) {
    const oaPaper = await fetch(
      `${baseOaUrl}/${id}?select=${openAlexFields.all}`,
    );
    const oaPaperJson = (await oaPaper.json()) as OpenAlexWorkMetadata;
    const data = {
      ...oaPaperJson,
      abstract: fromInvertedIndex(oaPaperJson.abstract_inverted_index, 350),
    };

    return await Redis.papers.upsert(id, undefined, { data });
  }
  return paper;
});
