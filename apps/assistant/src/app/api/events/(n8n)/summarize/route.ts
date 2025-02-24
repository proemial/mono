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

	const { operation, metadata, payload, input } = JSON.parse(text) as {
		operation: string;
		metadata: SlackEventMetadata;
		payload: SlackAskEvent | SlackAnnotateEvent;
		input: Record<string, string | Message[]>;
	};
	console.log(operation, metadata, payload, input);

	if (operation === "answer") {
		if (!input.messages || !input.prompt) {
			return NextResponse.json({
				error: "Missing messages or prompt in input",
			});
		}
		const result = await summarizeAnswerTask(
			metadata,
			payload as SlackAskEvent,
			input as { messages: Message[]; prompt: string },
		);
		return NextResponse.json(result);
	}
	if (operation === "annotate") {
		if (!input.prompt || !input.url || !input.title || !input.text) {
			return NextResponse.json({
				error: "Missing prompt, url, title, or text in input",
			});
		}
		const result = await summarizeAnnotationTask(
			metadata,
			payload as SlackAnnotateEvent,
			input as { prompt: string; url: string; title: string; text: string },
		);
		return NextResponse.json(result);
	}

	return NextResponse.json({
		error: "Unknown operation",
	});
}
