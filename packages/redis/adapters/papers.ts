import { UpStash } from "./upstash-client";
import { OpenAlexPaper } from "@proemial/models/open-alex";

export const OpenAlexPapers = {
  get: async (id: string) => {
    try {
      return (await UpStash.papers.get(`oa:${id}`)) as OpenAlexPaper;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  push: async (paper: OpenAlexPaper | Array<OpenAlexPaper>) => {
    try {
      if (!Array.isArray(paper)) {
        await UpStash.papers.set(`oa:${paper.data.id}`, paper);
      } else {
        const pipeline = UpStash.papers.pipeline();
        paper.forEach((paper) => {
          pipeline.set(`oa:${paper.data.id.split("/").at(-1)}`, paper);
        });

        await pipeline.exec();
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
