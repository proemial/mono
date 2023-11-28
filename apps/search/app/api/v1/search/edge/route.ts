import { run } from "@/app/api/v1/search/route";

export const runtime = "edge";

export async function POST(req: Request) {
  const { q, count, includes } = await req.json();
  return await run(q, count, includes);
}
