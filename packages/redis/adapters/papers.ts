import { UpStash } from "./upstash-client";
import {
  getIdFromOpenAlexPaper,
  OpenAlexPaper,
} from "@proemial/models/open-alex";

export const OpenAlexPapers = {
  get: async (id: string) => {
    try {
      return (await UpStash.papers.get(`oa:${id}`)) as OpenAlexPaper;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  pushAll: async (papers: OpenAlexPaper | Array<OpenAlexPaper>) => {
    if (Array.isArray(papers) && papers.length < 1) {
      return;
    }
    const papersArray = Array.isArray(papers) ? papers : [papers];

    try {
      console.log("[pushAll] pushing", papersArray.length, "papers");
      const pipeline = UpStash.papers.pipeline();
      papersArray.forEach((paper) => {
        const id = getIdFromOpenAlexPaper(paper);
        pipeline.set(`oa:${id}`, { ...paper, id });
      });

      await pipeline.exec();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  upsert: async (
    id: string,
    appendFn: (existingPaper: OpenAlexPaper) => OpenAlexPaper,
  ) => {
    try {
      const redisPaper = (await UpStash.papers.get(
        `oa:${id}`,
      )) as OpenAlexPaper;

      const updatedPaper = appendFn(redisPaper || {});

      console.log("[upsert] pushing paper", id);
      await UpStash.papers.set(`oa:${id}`, updatedPaper);

      return updatedPaper;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  upsertAll: async (papers: OpenAlexPaper | Array<OpenAlexPaper>) => {
    if (Array.isArray(papers) && papers.length < 1) {
      return;
    }

    const papersArray = Array.isArray(papers) ? papers : [papers];

    try {
      const pipeline = UpStash.papers.pipeline();
      papersArray.forEach((paper) => {
        const id = getIdFromOpenAlexPaper(paper);
        pipeline.get(`oa:${id}`);
      });
      const dbPapers = await pipeline.exec<OpenAlexPaper[]>();

      const dbPaperIds = dbPapers.map((paper) => paper?.id);
      const missingPapers = papersArray.filter(
        (paper) => !dbPaperIds.includes(paper?.id),
      );

      if (missingPapers.length > 0) {
        await OpenAlexPapers.pushAll(missingPapers);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
