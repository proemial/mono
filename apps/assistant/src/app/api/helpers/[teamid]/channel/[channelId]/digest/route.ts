import { NextResponse } from "next/server";
import { getDigest } from "./channel-digest";

export const revalidate = 0;
export const maxDuration = 300;

export async function GET(
	request: Request,
	{ params }: { params: { teamid: string; channelId: string } },
) {
	const { teamid, channelId: channel } = params;
	const digest = await getDigest({
		appId: "A08AD1FSPHV",
		teamId: teamid,
		channelId: channel,
	});

	return NextResponse.json(digest);
}
