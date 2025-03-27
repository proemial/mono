import { SlackDb } from "@proemial/adapters/mongodb/slack/slack.adapter";
import { WebClient } from "@slack/web-api";
import { NextResponse } from "next/server";
import channels from "./channels.json";
import { getDigest } from "../../../channel/[channelId]/digest/channel-digest";

export const revalidate = 0;

export async function GET(
	request: Request,
	{ params }: { params: { teamid: string; userid: string } },
) {
	const { teamid, userid } = params;

	const feeds = await Promise.all(
		channels.map(async (channel) =>
			getDigest({
				appId: "A08AD1FSPHV",
				teamId: teamid,
				channelId: channel.id,
			}),
		),
	);

	const mappedFeeds = feeds
		.filter((f) => f.annotations.length > 0)
		.flatMap((feed) =>
			feed.annotations.map((annotation) => ({
				channel: feed.channel,
				createdAt: annotation.createdAt.toISOString(),
				message: annotation.message,
				url: annotation.url,
				summary: annotation.summary,
				replyCount: annotation.replyCount,
				reactions: annotation.reactions || [],
			})),
		);

	return NextResponse.json(mappedFeeds);
}
