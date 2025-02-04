import { NextResponse } from "next/server";
import LlmModels from "@proemial/adapters/llm/models";
import { generateText } from "ai";
import { getChannelHistory } from "@proemial/adapters/slack/slack";
import { getChannelInfo } from "@proemial/adapters/slack/slack";

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
	const channelInfo = await getChannelInfo(teamId, channelId);

	const { text } = await generateText({
		model: await LlmModels.api.summariseChannel(),
		messages: [
			{
				role: "user",
				content: `
In a single paragraph, summarise the gist of this slack channel:

Channel info:
${JSON.stringify(channelInfo)}

Channel history:
${JSON.stringify(messages)}

Do not refer to it as being discussions in Slack and do not refer to abstract concepts like conversations, channels or similar, just summarise the gist.
        `,
			},
		],
	});

	return NextResponse.json(text);
}
