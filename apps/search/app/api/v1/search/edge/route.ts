import { NextResponse } from "next/server";
import { Time } from "@proemial/utils/time";
import { fetchPapers } from "@/app/api/v1/search/search";

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
