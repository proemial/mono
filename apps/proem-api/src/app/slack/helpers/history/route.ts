import { NextResponse } from "next/server";
import { getChannelHistory } from "@proemial/adapters/slack/slack";

export const revalidate = 0;

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const channelId = searchParams.get("channelId");
	const teamId = searchParams.get("teamId");

	if (!channelId || !teamId) {
		return NextResponse.json(
			{ error: "Missing required parameters: channelId and teamId" },
			{ status: 400 },
		);
	}

	const messages = await getChannelHistory(channelId, teamId);
	return NextResponse.json(messages);
}
