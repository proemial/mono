import { NextResponse } from "next/server";

export const revalidate = 0;

export async function POST(request: Request) {
	const text = await request.text();
	const unencoded = text?.startsWith("payload=")
		? decodeURIComponent(text.slice(8))
		: text;

	const body = JSON.parse(unencoded);
	console.log(JSON.stringify(body));

	if (body.type === "block_actions") {
		console.log("block_actions");
		const result = await fetch(body.response_url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				text: "From Do stuff button",
				thread_ts: body.message.ts,
			}),
		});

		return NextResponse.json({ body, result });
	}

	const result = await fetch(
		"https://hooks.slack.com/services/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",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
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
			}),
		},
	);

	return NextResponse.json({ body, result });
}
