import { fetchPapers } from "@/app/api/v2/search/search";
import { Time } from "@proemial/utils/time";
import { track } from "@vercel/analytics/server";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  const { q, count, tokens } = await req.json();
  // const apiKey = req.headers.get("authorization");
  // console.log({ auth: apiKey });

  // if (apiKey !== `Basic ${Env.get("GPT_API_KEY")}`) {
  //   console.log("auth failed");
  // }

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

export const dynamic = "force-dynamic"; // defaults to auto
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");
  const count = req.nextUrl.searchParams.get("count");
  const tokens = req.nextUrl.searchParams.get("tokens");
  // const apiKey = req.headers.get("authorization");
  // // console.log({ auth: apiKey });

  // // if (apiKey !== `Basic ${Env.get("GPT_API_KEY")}`) {
  // //   console.log("auth failed");
  // // }

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
