import { SlackDb } from "@proemial/adapters/mongodb/slack/slack.adapter";
import { NextResponse } from "next/server";

export const revalidate = 0;

export async function POST(request: Request) {
	try {
		const text = await request.text();
		const data = JSON.parse(text) as {
			id: string;
			payload: unknown;
		};

		if (!data?.id || !data?.payload) {
			return NextResponse.json(
				{ error: "Invalid request, missing id or payload" },
				{ status: 400 },
			);
		}

		console.log("/slack/events/outbound");
		console.log(JSON.stringify(data));

		const target = await getTarget(data);
		console.log(target);

		const result = await fetch(target.url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				...target.headers,
			},
			body: JSON.stringify({ ...target.body, ...data.payload }),
		});

		return NextResponse.json({ body: data, result });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: JSON.stringify(error) }, { status: 500 });
	}
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
async function getTarget(body: any): Promise<Target> {
	if (body.response_url) {
		return {
			url: body.response_url,
			headers: {},
			body: {},
		};
	}

	const teamId = (body.event.team ?? body.message.team) as string;
	if (!teamId) {
		throw new Error("TeamId not found");
	}

	const team = await SlackDb.entities.get(teamId);
	if (!team) {
		throw new Error("Team not found");
	}
	if (!team.metadata?.accessToken) {
		throw new Error("Token not found");
	}

	return {
		url: "https://slack.com/api/chat.postMessage",
		headers: {
			Authorization: `Bearer ${team.metadata?.accessToken}`,
		},
		body: {
			channel: body.event.channel,
		},
	};
}

type Target = {
	url: string;
	headers: Partial<Record<string, string>>;
	body: Partial<Record<string, string>>;
};
