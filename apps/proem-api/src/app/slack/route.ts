import { NextResponse } from "next/server";

export const revalidate = 0;

export async function POST(request: Request) {
	const url = request.url;
	console.log(url);

	const text = await request.text();
	console.log(text);

	let body: unknown;
	try {
		body = JSON.parse(text);
		console.log(JSON.stringify(body));
	} catch (e) {
		return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
	}

	const response = {
		blocks: [
			{
				type: "header",
				text: {
					type: "plain_text",
					text: "This was not what you expected",
					emoji: true,
				},
			},
			{
				type: "section",
				text: {
					type: "mrkdwn",
					text: "... neither was this",
				},
			},
			{
				type: "actions",
				elements: [
					{
						type: "button",
						text: {
							type: "plain_text",
							text: "↕️ Do stuff",
							emoji: true,
						},
						value: "do_stuff",
					},
				],
			},
		],
	};

	const result = await fetch(
		"https://hooks.slack.com/services/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",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(response),
		},
	);

	return NextResponse.json({ url, body, result });
}
