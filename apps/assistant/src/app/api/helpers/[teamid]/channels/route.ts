import { SlackDb } from "@proemial/adapters/mongodb/slack/slack.adapter";
import { NextResponse } from "next/server";

export const revalidate = 0;

export async function GET(
	request: Request,
	{ params }: { params: { teamid: string } },
) {
	const { teamid } = params;
	const app = await SlackDb.installs.get(teamid, "A08BFJ29A5Q");
	if (!app) {
		return NextResponse.json({ error: "App not found" }, { status: 404 });
	}

	const result = await fetch("https://slack.com/api/conversations.list", {
		method: "GET",
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			Authorization: `Bearer ${app.metadata.accessToken}`,
		},
	});

	const json = await result.json();
	return NextResponse.json(
		json.channels
			.filter((channel: { is_archived: boolean }) => !channel.is_archived)
			.map(
				(channel: {
					id: string;
					name: string;
					topic: { value: string };
					purpose: { value: string };
				}) => ({
					id: channel.id,
					name: channel.name,
					topic: channel.topic.value,
					purpose: channel.purpose.value,
				}),
			),
	);
}
