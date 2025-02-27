import { SlackDb } from "@proemial/adapters/mongodb/slack/slack.adapter";
import { NextResponse } from "next/server";

export const revalidate = 0;

export async function GET(
	request: Request,
	{ params }: { params: { teamid: string; userid: string } },
) {
	const { teamid, userid } = params;
	const app = await SlackDb.installs.get(teamid, "A08BFJ29A5Q");
	if (!app) {
		return NextResponse.json({ error: "App not found" }, { status: 404 });
	}

	const userResult = await fetch(
		`https://slack.com/api/users.info?user=${userid}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				Authorization: `Bearer ${app.metadata.accessToken}`,
			},
		},
	);

	const userJson = await userResult.json();
	if (!userJson.ok) {
		return NextResponse.json({ error: "User not found" }, { status: 404 });
	}

	const teamResult = await fetch(
		`https://slack.com/api/team.info?team=${teamid}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				Authorization: `Bearer ${app.metadata.accessToken}`,
			},
		},
	);

	const teamJson = await teamResult.json();
	if (!teamJson.ok) {
		return NextResponse.json(teamJson, { status: 404 });
	}

	return NextResponse.json({
		user: {
			id: userJson.user.id,
			real_name: userJson.user.real_name,
			display_name: userJson.user.profile.display_name,
			image_original: userJson.user.profile.image_original,
		},
		team: {
			id: teamJson.team.id,
			name: teamJson.team.name,
			domain: teamJson.team.domain,
		},
	});
}
