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

  push: async (paper: OpenAlexPaper) => {
    try {
      await UpStash.papers.set(`oa:${paper.id}`, paper);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
