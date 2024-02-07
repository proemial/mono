import { cache } from "react";
import { Redis } from "@proemial/redis/redis";
import {
  baseOaUrl,
  openAlexFields,
  OpenAlexPaper,
  OpenAlexWorkMetadata,
  OpenAlexWorksHit,
  OpenAlexWorksSearchResult,
} from "@proemial/models/open-alex";
import { fromInvertedIndex } from "@proemial/utils/string";
import { fetchJson } from "@proemial/utils/fetch";
import { Env } from "@proemial/utils/env";
import dayjs from "dayjs";

export const fetchPaper = cache(
  async (id: string): Promise<OpenAlexPaper | undefined> => {
    console.log("fetchPaper");
    const paper = await Redis.papers.get(id);

    if (!(paper?.data as OpenAlexWorkMetadata)?.doi) {
      const oaPaper = await fetch(
        `${baseOaUrl}/${id}?select=${openAlexFields.all}`,
      );
      if (!oaPaper.ok) {
        console.error(
          `Failed to fetch paper ${id} from OpenAlex (${oaPaper.status}: ${oaPaper.statusText})`,
        );
        return undefined;
      }
      const oaPaperJson = (await oaPaper.json()) as OpenAlexWorkMetadata;
      const data = {
        ...oaPaperJson,
        abstract: fromInvertedIndex(oaPaperJson.abstract_inverted_index, 350),
      };

      return await Redis.papers.upsert(id, (existingPaper) => {
        return {
          ...existingPaper,
          data,
          id,
        };
      });
    }
    return paper;
  },
);

export const fetchLatestPaperIds = async (): Promise<string[]> => {
  const today = dayjs().format("YYYY-MM-DD");
  const twoWeeksAgo = dayjs(today).subtract(2, "week").format("YYYY-MM-DD");
  const select = ["id", "publication_date", "concepts"].join(",");
  const filter = [
    "type:article",
    "has_abstract:true",
    `from_created_date:${twoWeeksAgo}`,
    `publication_date:>${twoWeeksAgo}`, // We do not want old papers that were added recently
    `publication_date:<${today}`, // We do not want papers published in the future
  ].join(",");
  const sort = "from_created_date:desc";
  const oaApiKey = Env.get("OPENALEX_API_KEY");
  // This will include 25 paper IDs (one pagination page), which seems appropriate
  // for a feed.
  const oaPapers = await fetchJson<OpenAlexWorksSearchResult>(
    `${baseOaUrl}?select=${select}&filter=${filter}&sort=${sort}&api_key=${oaApiKey}`,
  );
  return (
    oaPapers?.results
      .sort(sortByPublicationDateDesc)
      .map((result) => result.id.replace("https://openalex.org/", "")) ?? []
  );
};

const sortByPublicationDateDesc = (a: OpenAlexWorksHit, b: OpenAlexWorksHit) =>
  b.publication_date.localeCompare(a.publication_date);
