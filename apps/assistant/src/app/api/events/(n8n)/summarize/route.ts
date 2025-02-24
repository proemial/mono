import { NextResponse } from "next/server";
import { SlackEventMetadata } from "@proemial/adapters/slack/models/metadata-models";
import { summarizeAnswerTask } from "@/inngest/workers/ask/1-summarize.task";
import { SlackAnnotateEvent, SlackAskEvent } from "@/inngest/workers";
import { Message } from "ai";
import { summarizeAnnotationTask } from "@/inngest/workers/annotate/2-summarize.task";

export const revalidate = 0;

export async function POST(request: Request) {
	const text = await request.text();

	console.log("/slack/events/summarize");
	console.log(text);

	const { operation, metadata, payload, messages, prompt } = JSON.parse(
		text,
	) as {
		operation: string;
		metadata: SlackEventMetadata;
		payload: SlackAskEvent | SlackAnnotateEvent;
		messages: Message[];
		prompt: string;
	};
	console.log(operation, metadata, payload, messages, prompt);

	if (operation === "answer") {
		const result = await summarizeAnswerTask(
			metadata,
			payload as SlackAskEvent,
			messages,
			prompt,
		);
		return NextResponse.json(result);
	}
	if (operation === "annotate") {
		const result = await summarizeAnnotationTask(
			metadata,
			payload as SlackAnnotateEvent,
			messages,
			prompt,
		);
		return NextResponse.json(result);
	}

	return NextResponse.json({
		error: "Unknown operation",
	});
}
