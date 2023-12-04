import { Time } from "@proemial/utils/time";
import { fetchPapers } from "@/app/api/v1/search/search";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  const { q, count, includes, filter } = await req.json();

  const begin = Time.now();
  try {
    const response = await fetchPapers(q, count, includes, filter);

    return NextResponse.json(response);
  } finally {
    Time.log(begin, "api/v1/search");
  }
}
