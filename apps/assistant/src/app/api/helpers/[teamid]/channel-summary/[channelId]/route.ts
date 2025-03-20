import { SlackDb } from "@proemial/adapters/mongodb/slack/slack.adapter";
import { NextResponse } from "next/server";
import { WebClient } from "@slack/web-api";
import { summarizeChannel } from "@/prompts/channel/summarize-channel";

export const revalidate = 0;
export const maxDuration = 300;

export async function GET(
	request: Request,
	{ params }: { params: { teamid: string; channelId: string } },
) {
	const { teamid, channelId: channel } = params;
	const app = await SlackDb.installs.get(teamid, "A08AD1FSPHV");
	if (!app) {
		return NextResponse.json({ error: "App not found" }, { status: 404 });
	}

	const slack = new WebClient(app.metadata.accessToken);

	const channelInfo = await slack.conversations.info({
		channel,
	});
	const channelDescription = {
		name: channelInfo.channel?.name as string,
		topic: channelInfo.channel?.topic?.value as string,
		purpose: channelInfo.channel?.purpose?.value as string,
	};
	const history = await slack.conversations.history({
		channel,
		limit: 100,
	});

	const result = await summarizeChannel(
		channelDescription,
		history.messages?.map((message) => message.text as string) ?? [],
	);

	return NextResponse.json(result.summary);
}
