import { NextResponse } from "next/server";
import { Time } from "@proemial/utils/time";
import { fetchPapers } from "@/app/api/v1/search/search";

export async function POST(req: Request) {
  const { q, count, includes } = await req.json();

  const begin = Time.now();
  try {
    const response = await fetchPapers(q, count, includes);

    return NextResponse.json(response);
  } finally {
    Time.log(begin, "api/v1/search");
  }
}
