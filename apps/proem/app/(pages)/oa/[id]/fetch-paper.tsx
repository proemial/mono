import { cache } from "react";
import { Redis } from "@proemial/redis/redis";
import { OpenAlexPaper } from "@proemial/models/open-alex";

export const fetchPaper = cache(async (id: string): Promise<OpenAlexPaper> => {
  return await Redis.papers.get(id);
});
