import { Redis } from "@upstash/redis";

if (!process.env.REDIS_PAPERS_URL || !process.env.REDIS_PAPERS_TOKEN) {
  throw new Error(
    "[redis-client] Missing connection string, run `pnpm run vercel-pull-env`",
  );
}

export const UpStash = {
  papers: new Redis({
    url: process.env.REDIS_PAPERS_URL,
    token: process.env.REDIS_PAPERS_TOKEN,
  }),
};
