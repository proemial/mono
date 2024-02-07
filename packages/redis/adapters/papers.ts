import { UpStash } from "./upstash-client";
import {
  getIdFromOpenAlexPaper,
  OpenAlexPaper,
  OpenAlexWorkCoreMetadata,
  WithAbstract,
  WithData,
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

  pushAll: async (papers: WithData | Array<WithData>) => {
    if (Array.isArray(papers) && papers.length < 1) {
      return;
    }

    try {
      if (!Array.isArray(papers)) {
        const id = getIdFromOpenAlexPaper(papers);
        await UpStash.papers.set(`oa:${id}`, { id, paper: papers });
      } else {
        const pipeline = UpStash.papers.pipeline();
        papers.forEach((paper) => {
          const id = getIdFromOpenAlexPaper(paper);
          pipeline.set(`oa:${id}`, { ...paper, id });
        });

        await pipeline.exec();
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  upsert: async (
    id: string,
    appendFn: (existingPaper: OpenAlexPaper) => OpenAlexPaper
  ) => {
    try {
      const redisPaper = (await UpStash.papers.get(
        `oa:${id}`
      )) as OpenAlexPaper;

      const updatedPaper = appendFn(redisPaper || {});

      await UpStash.papers.set(`oa:${id}`, updatedPaper);

      return updatedPaper;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
