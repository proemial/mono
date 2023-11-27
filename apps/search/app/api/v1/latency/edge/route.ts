import { NextResponse } from "next/server";
import { Log, Time } from "@/app/utils/time";

export const runtime = "edge";

export async function POST(req: Request) {
  const begin = Time.now();

  try {
    const body = await req.json();
    return NextResponse.json(body);
  } finally {
    Log.metrics(begin, "api/v1/latency/edge");
  }
}
