import { db } from "@proemial/database/db";
import { papers } from "@proemial/database/schema/paper";
import { Redis } from "@proemial/redis/redis";
import { eq } from "drizzle-orm";

import { unstable_noStore as noStore } from "next/cache";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  noStore();
  const redisTimer = process.hrtime();
  const redisPaper = await Redis.papers.get(params.id);
  const redisDuration = process.hrtime(redisTimer);

  const neonTimer = process.hrtime();
  const neonPaper = await db
    .select()
    .from(papers)
    .where(eq(papers.id, params.id));

  const neonDuration = process.hrtime(neonTimer);

  return Response.json({
    redisDuration,
    neonDuration,
    redis: redisPaper,
    neon: neonPaper,
  });
}
