import { db } from "@proemial/database/db";
import { testTable } from "@proemial/database/schema/test";
import { unstable_noStore as noStore } from "next/cache";

export async function GET() {
  noStore();
  const number = Math.floor(Math.random() * 10000);
  const result = await db
    .insert(testTable)
    .values({ name: "test", id: number, value: number })
    .onConflictDoNothing()
    .returning();

  return Response.json({ result });
}
