import { Time } from "@proemial/utils/time";
import { fetchPapers } from "@/app/api/v2/search/search";
import { track } from "@vercel/analytics/server";
import { NextResponse } from "next/server";
import { Env } from "@proemial/utils/env";

export const runtime = "edge";

export async function POST(req: Request) {
  const { q, count, tokens } = await req.json();
  const apiKey = req.headers.get("authorization");
  console.log({ auth: apiKey });

  if (apiKey !== `Basic ${Env.get("GPT_API_KEY")}`) {
    console.log("auth failed");
  }

  const begin = Time.now();
  try {
    const response = await fetchPapers(q, count, tokens);
    await track("api:search-papers", {
      q,
      count,
      tokens,
    });

    return NextResponse.json(response);
  } finally {
    Time.log(begin, "api/v2/search");
  }
}
