import { NextResponse } from "next/server";

export const revalidate = 0;

export async function POST(request: Request) {
	const text = await request.text();
	const unencoded = text?.startsWith("payload=")
		? decodeURIComponent(text.slice(8))
		: text?.startsWith("ssl_check=")
			? decodeURIComponent(text.slice(10))
			: text;

	const payload = JSON.parse(unencoded);

	console.log("/slack/broker/in");
	console.log(JSON.stringify(payload));

	if (payload.type === "url_verification") {
		return NextResponse.json({ challenge: payload.challenge });
	}
	if (payload.type === "ssl_check") {
		return NextResponse.json({ status: "ok" });
	}

	const result = await fetch(
		"https://proem.app.n8n.cloud/webhook/fbf6889f-f8d9-4f36-b966-00f38a502a85",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				id: "dummy",
				payload,
			}),
		},
	);

	return NextResponse.json({ body: payload, result });
}
