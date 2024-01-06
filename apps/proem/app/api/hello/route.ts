import { inngest } from "@/inngest-events";
import { NextResponse } from "next/server";

// Opt out of caching; every request should send a new event
export const dynamic = "force-dynamic";

// Create a simple async Next.js API route handler
export async function GET() {
  // Send your event payload to Inngest
  await inngest.send({
    name: "demo/event.sent",
    data: {
      message: "testFromNext@example.com",
    },
  });

  return NextResponse.json({ name: "Hello Inngest from Next!" });
}
