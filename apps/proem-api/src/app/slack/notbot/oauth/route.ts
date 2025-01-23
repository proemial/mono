import { NextResponse } from "next/server";

export const revalidate = 0;

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const code = searchParams.get("code");
	const error = searchParams.get("error");
	console.log("Slack code", code);

	if (error) {
		console.error("OAuth error:", error);
		return NextResponse.json({ error }, { status: 400 });
	}

	if (!code) {
		return NextResponse.json({ error: "No code provided" }, { status: 400 });
	}

	const clientId = process.env.SLACK_NOTBOT_CLIENT_ID;
	const clientSecret = process.env.SLACK_NOTBOT_CLIENT_SECRET;

	if (!clientId || !clientSecret) {
		console.error("Missing Slack credentials in environment variables");
		return NextResponse.json(
			{ error: "Server configuration error" },
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

		// Here you should store the access token securely
		// data.access_token - bot token
		// data.team.id - workspace ID
		// data.team.name - workspace name
		// TODO: Store these securely in your database

		// Redirect to a success page or back to your app
		return NextResponse.redirect(new URL("/slack/oauth/success", request.url));
	} catch (error) {
		console.error("OAuth error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
