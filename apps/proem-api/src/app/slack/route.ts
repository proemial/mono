import { NextResponse } from "next/server";

export async function POST(request: Request) {
	const body = await request.json();
	const url = request.url;

	console.log(url);
	console.log(JSON.stringify(body));

	return NextResponse.json({
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
	});
}
