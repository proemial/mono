import { NextResponse } from "next/server";
import { getChannelSummary } from "./channel-summary";

export const revalidate = 0;
export const maxDuration = 300;

export async function GET(
	request: Request,
	{ params }: { params: { teamid: string; channelId: string } },
) {
	const { teamid, channelId: channel } = params;
	const channelSummary = await getChannelSummary({
		appId: "A08AD1FSPHV",
		teamId: teamid,
		channelId: channel,
	});

	return NextResponse.json(channelSummary);
}
