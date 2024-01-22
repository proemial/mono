import { speedTestPaper } from "@/app/(pages)/oa/[id]/speedtest/speedTestPaper";

import { unstable_noStore as noStore } from "next/cache";

export const runtime = "edge";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  noStore();
  const response = await speedTestPaper(params.id);

  return Response.json(response);
}
