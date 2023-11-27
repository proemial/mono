import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  const begin = DateMetrics.now();

  try {
    const body = await req.json();
    return NextResponse.json(body);
  } finally {
    Log.metrics(begin, "api/v1/latency");
  }
}

const Log = {
  metrics: (begin: number, message: string) => {
    console.log(`[${DateMetrics.elapsed(begin)}] ${message}`);
  },
};

const DateMetrics = {
  now: () => new Date().getTime(),
  elapsed: (begin: number) => DateMetrics.now() - begin,
};
