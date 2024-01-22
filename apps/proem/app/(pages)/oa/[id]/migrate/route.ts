import { db } from "@proemial/database/db";
import { papers } from "@proemial/database/schema/paper";
import { Redis } from "@proemial/redis/redis";

import { unstable_noStore as noStore } from "next/cache";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  noStore();

  const redisPaper = await Redis.papers.get(params.id);
  const [neonPaper] = await db
    .insert(papers)
    .values({
      id: params.id,
      data: redisPaper.data,
      datab: redisPaper.data,
      generated: redisPaper.generated,
    })
    .returning();

  return Response.json({ redisPaper, neonPaper });
}
