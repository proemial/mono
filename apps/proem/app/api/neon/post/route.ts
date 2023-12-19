import { db } from "@proemial/database/db";
import { testTable } from "@proemial/database/schema/test";
import { unstable_noStore as noStore } from "next/cache";

export async function GET() {
  noStore();
  const number = Math.floor(Math.random() * 10000);
  const result = await db
    .insert(testTable)
    .values({
      id: number,
      name: "test",
      value: 1.0,
      newValue: 2.0,
      next: 3.0,
      hello: number,
    })
    .onConflictDoNothing()
    .returning();

  return Response.json({ result });
}
