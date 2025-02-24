import { NextResponse } from "next/server";
import { SlackEventMetadata } from "@proemial/adapters/slack/models/metadata-models";

export const revalidate = 0;

export async function POST(request: Request) {
	const text = await request.text();

	console.log("/slack/events/summarize");
	console.log(text);

	const { metadata, payload } = JSON.parse(text) as {
		metadata: SlackEventMetadata;
		payload: unknown;
	};
	console.log(metadata, payload);

	return NextResponse.json({
		summary: "The weather in Tokyo is always sunny.",
	});
}
