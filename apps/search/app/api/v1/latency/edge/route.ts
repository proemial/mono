import { NextResponse } from "next/server";
import { Time } from "@proemial/utils/time";

export const runtime = "edge";

export async function POST(req: Request) {
  const begin = Time.now();

  try {
    const body = await req.json();
    return NextResponse.json(body);
  } finally {
    Time.log(begin, "api/v1/latency/edge");
  }
}
