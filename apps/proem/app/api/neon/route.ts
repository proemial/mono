import { db } from "@proemial/database/db";
import { testTable } from "@proemial/database/schema/test";
import { unstable_noStore as noStore } from "next/cache";

export async function GET() {
  noStore();
  const result = await db.select().from(testTable);
  console.log({ result });

  return Response.json({ result });
}
