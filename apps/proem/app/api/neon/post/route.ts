import { db } from "@proemial/database/db";
import { testTable } from "@proemial/database/schema/test";

export async function GET() {
  const number = Math.floor(Math.random() * 10000);
  const result = await db
    .insert(testTable)
    .values({ name: "test", id: number, value: number });

  return Response.json({ result });
}
