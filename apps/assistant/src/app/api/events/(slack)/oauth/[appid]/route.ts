import { NextRequest, NextResponse } from "next/server";
import { SlackDb } from "@proemial/adapters/mongodb/slack/slack.adapter";
import { uuid } from "@proemial/utils/uid";

export const revalidate = 0;

type Props = Promise<{ appid: string }>;

export async function GET(request: NextRequest, { params }: { params: Props }) {
	const { appid } = await params;

	const { searchParams } = new URL(request.url);
	const code = searchParams.get("code");
	const error = searchParams.get("error");

	if (error) {
		console.error("OAuth error:", error);
		return NextResponse.json({ error }, { status: 400 });
	}
	if (!code) {
		return NextResponse.json({ error: "No code provided" }, { status: 400 });
	}

	const app = await SlackDb.entities.get(appid);
	if (!app || !app.metadata) {
		return NextResponse.json({ error: "App not found" }, { status: 404 });
	}

	const { clientId, clientSecret } = app.metadata;
	if (!clientId || !clientSecret) {
		console.error("Missing Slack credentials");
		return NextResponse.json(
			{ error: "Missing Slack credentials" },
			{ status: 500 },
		);
	}

	try {
		// Exchange the temporary code for an access token
		const result = await fetch("https://slack.com/api/oauth.v2.access", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams({
				code,
				client_id: clientId,
				client_secret: clientSecret,
			}),
		});

		const data = await result.json();
		console.log("Slack response", JSON.stringify(data));

		if (!data.ok) {
			console.error("OAuth error:", data.error);
			return NextResponse.json({ error: data.error }, { status: 400 });
		}

		const appId = data.app_id ?? data.api_app_id;
		const app = await SlackDb.apps.get(appId);
		const teamId = data.team?.id ?? data.team_id;
		const teamName = data.team?.name;

		const insertedEvent = await SlackDb.events.insert({
			createdAt: new Date(),
			metadata: {
				appId,
				teamId,
				eventId: data.event_id ?? uuid(),
			},
			source: "slack",
			type: "SlackOauthEvent",
			payload: data,
		});
		console.log("Inserted oauth event", insertedEvent);

		const auth =
			data.authed_user?.token_type === "user"
				? {
						user: {
							id: data.authed_user.id,
							name: data.authed_user.name,
						},
						metadata: { accessToken: data.authed_user.access_token },
					}
				: { metadata: { accessToken: data.access_token } };

		const upsertedEntity = await SlackDb.installs.upsert({
			createdAt: new Date(),
			type: "install",
			team: {
				id: teamId,
				name: teamName,
			},
			app: {
				id: appId,
				name: app?.name,
			},
			...auth,
		});
		console.log("Upserted team entity", upsertedEntity);

		// Redirect to a success page or back to your app
		return NextResponse.redirect(
			new URL(`/slack/welcome/${data.team.id}`, request.url),
		);
	} catch (error) {
		console.error("OAuth error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
