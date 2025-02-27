import { NextResponse } from "next/server";
import { getTarget } from "@proemial/adapters/slack/helpers/routing";
import { SlackDb } from "@proemial/adapters/mongodb/slack/slack.adapter";
import { SlackEventMetadata } from "@proemial/adapters/slack/models/metadata-models";

export const revalidate = 0;

export async function POST(request: Request) {
	try {
		const text = await request.text();

		console.log("/slack/events/outbound");
		console.log(text);

		const { metadata, payload } = JSON.parse(text) as {
			metadata: SlackEventMetadata;
			payload: unknown;
		};

		if (!metadata || !payload) {
			return NextResponse.json(
				{ error: "Invalid request, missing metadata or payload" },
				{ status: 400 },
			);
		}

		const target = await getTarget({ metadata, payload });

		const result = await fetch(target.url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				...target.headers,
			},
			body: JSON.stringify({ ...target.body, ...payload }),
		});

		return NextResponse.json({ metadata, payload, result });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: JSON.stringify(error) }, { status: 500 });
	}
}
