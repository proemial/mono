import { NextResponse } from "next/server";
import { fetchPapers } from "@/app/api/v1/search/oapaper";
import { Time } from "@proemial/utils/time";

export const runtime = "edge";

export async function POST(req: Request) {
  const begin = Time.now();

  try {
    const { q } = await req.json();

    const response = await fetchPapers(q);

    return NextResponse.json(response);
  } finally {
    Time.log(begin, "api/v1/search");
  }
}
