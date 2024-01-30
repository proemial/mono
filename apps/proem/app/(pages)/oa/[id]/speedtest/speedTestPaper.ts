import { neonDb } from "@proemial/data";
import { papers } from "@proemial/data/neon/schema/paper";
import { OpenAlexPaper } from "@proemial/models/open-alex";
import { Redis } from "@proemial/redis/redis";
import { eq } from "drizzle-orm";

async function migrateRedisPaperToNeon(redisPaper: OpenAlexPaper) {
  try {
    await neonDb.insert(papers).values({
      id: redisPaper.id,
      data: redisPaper.data,
      generated: redisPaper.generated,
    });
  } catch (e) {
    console.log("paper already exists in neon");
    console.log(e);
  }
}

export async function speedTestPaper(paperId: string) {
  const redisTimerStart = Date.now();
  const redisPaper = await Redis.papers.get(paperId);
  const redisTimerEnd = Date.now();
  const redisDuration = redisTimerEnd - redisTimerStart;

  await migrateRedisPaperToNeon(redisPaper);

  const neonTimerStart = Date.now();
  const [neonPaper] = await neonDb
    .select()
    .from(papers)
    .where(eq(papers.id, paperId));
  const neonTimerEnd = Date.now();
  const neonDuration = neonTimerEnd - neonTimerStart;

  return {
    redisDuration,
    neonDuration,
    winner: redisDuration < neonDuration ? "redis" : "neon",
    isEqual: JSON.stringify(redisPaper) === JSON.stringify(neonPaper),
    redis: redisPaper,
    neon: neonPaper,
  };
}
