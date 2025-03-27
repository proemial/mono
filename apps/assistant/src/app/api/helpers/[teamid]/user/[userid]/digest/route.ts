import { SlackDb } from "@proemial/adapters/mongodb/slack/slack.adapter";
import { WebClient } from "@slack/web-api";
import { NextResponse } from "next/server";
import channels from "./channels.json";
import { getDigest } from "../../../channel/[channelId]/digest/channel-digest";

export const maxDuration = 300; // seconds

export async function GET(
	request: Request,
	{ params }: { params: { teamid: string; userid: string } },
) {
	const { teamid, userid } = params;

	const feeds = await Promise.all(
		channels.map(async (channel) => {
			try {
				return getDigest({
					appId: "A08AD1FSPHV",
					teamId: teamid,
					channelId: channel.id,
				});
			} catch (error) {
				console.error(error);
				return null;
			}
		}),
	);

	const mappedFeeds = feeds
		.filter((f) => f?.annotations.length)
		.flatMap((feed) =>
			feed?.annotations.map((annotation) => ({
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
