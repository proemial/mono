import { NextResponse } from "next/server";
import { fetchPapers } from "@/app/api/v1/search/oapaper";
import { Log, Time } from "@/app/utils/time";

export const runtime = "edge";

export async function POST(req: Request) {
  const begin = Time.now();

  try {
    const { q } = await req.json();

    const response = await fetchPapers(q);

    return NextResponse.json(response);
  } finally {
    Log.metrics(begin, "api/v1/search");
  }
}
