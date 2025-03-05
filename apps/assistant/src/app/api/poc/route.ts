import { NextResponse } from "next/server";
import { SlackDb } from "@proemial/adapters/mongodb/slack/slack.adapter";
import { WebClient, LogLevel } from "@slack/web-api";
export const revalidate = 0;

export async function GET() {
	const tokens = await SlackDb.installs.getTokensForUserAndTeam(
		"T05A541540J",
		"A08BFJ29A5Q",
		"U05AUQHGPEU",
	);

	const slack = new WebClient(tokens.userToken, {
		logLevel: LogLevel.DEBUG,
	});

	// 	channelId: "C08B4RXM2AE",
	// 	ts: "1741178216.026259",

	const message = await slack.chat.update({
		channel: "C08B4RXM2AE",
		ts: "1741178532.048749",
		attachments: [
			{
				color: "#00FF00",
				blocks: [
					{
						type: "context",
						elements: [
							{
								type: "image",
								image_url: "https://assistant.proem.ai/slack/spinner.gif",
								alt_text: "",
							},
							{
								type: "mrkdwn",
								text: "text",
							},
						],
					},
				],
			},
		],
	});
	return NextResponse.json(message);
}
