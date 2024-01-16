import { fetchPapers } from "@/app/api/v2/search/search";
import { Env } from "@proemial/utils/env";
import { Time } from "@proemial/utils/time";
import { track } from "@vercel/analytics/server";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic"; // defaults to auto

export async function POST(req: Request) {
  const { q, count, tokens } = await req.json();
  // const apiKey = req.headers.get("authorization");
  // console.log({ auth: apiKey });

  // if (apiKey !== `Basic ${Env.get("GPT_API_KEY")}`) {
  //   console.log("auth failed");
  // }
  console.log({ q, count, tokens });

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

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get("authorization");
  console.log({ headers: req.headers });
  console.log({ apiKey });

  if (apiKey !== `Basic ${Env.get("GPT_API_KEY")}`) {
    return Response.json({ success: false }, { status: 401 });
  }

  const q = req.nextUrl.searchParams.get("q")!;
  const count = req.nextUrl.searchParams.get("count") as any as number;
  const tokens = req.nextUrl.searchParams.get("tokens") as any as number;

  if (!q) {
    return Response.json(
      { success: "false", message: "missing q param" },
      { status: 400 }
    );
  }

  const begin = Time.now();
  try {
    const response = await fetchPapers(q, count, tokens);
    await track("api:search-papers", {
      q,
      count,
      tokens,
    });

    return Response.json(response);
  } finally {
    Time.log(begin, "api/v2/search");
  }
}
