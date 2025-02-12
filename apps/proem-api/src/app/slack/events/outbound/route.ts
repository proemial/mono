import { NextResponse } from "next/server";
import { getTarget } from "../../utils/routing";
import { SlackDb } from "@proemial/adapters/mongodb/slack/slack.adapter";

export const revalidate = 0;

export async function POST(request: Request) {
	try {
		const text = await request.text();

		console.log("/slack/events/outbound");
		console.log(text);

		const { metadata, payload } = JSON.parse(text) as {
			metadata: {
				appId: string;
				eventId: string;
				teamId: string;
			};
			payload: unknown;
		};

		if (!metadata?.eventId || !payload) {
			return NextResponse.json(
				{ error: "Invalid request, missing metadata.eventId or payload" },
				{ status: 400 },
			);
		}

		const updated = await SlackDb.events.insert({
			createdAt: new Date(),
			metadata,
			source: "n8n",
			type: "N8nEvent",
			payload,
		});
		console.log(updated);

		const target = await getTarget({ metadata, payload });
		console.log(target);

		const result = await fetch(target.url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				...target.headers,
			},
			body: JSON.stringify({ ...target.body, ...payload }),
		});
		console.log(result);

		return NextResponse.json({ metadata, payload, result });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: JSON.stringify(error) }, { status: 500 });
	}
}
