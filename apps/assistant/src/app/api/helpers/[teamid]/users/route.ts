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

	const result = await fetch("https://slack.com/api/users.list?limit=200", {
		method: "GET",
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			Authorization: `Bearer ${app.metadata.accessToken}`,
		},
	});
	const json = await result.json();

	// https://api.slack.com/apis/pagination#methods
	console.log("response_metadata", json.response_metadata);

	return NextResponse.json(
		json.members.filter(
			(member: { is_bot: boolean; deleted: boolean; name: string }) =>
				!member.is_bot && !member.deleted && member.name !== "slackbot",
		),
	);
}
