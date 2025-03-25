import { summarizeChannel } from "../../../../../../../prompts/channel/summarize-channel";
import { SlackDb } from "@proemial/adapters/mongodb/slack/slack.adapter";
import { WebClient } from "@slack/web-api";

export async function getChannelSummary(metadata: {
	appId: string;
	teamId: string;
	channelId: string;
}) {
	const app = await SlackDb.installs.get(metadata.teamId, metadata.appId);
	if (!app) {
		throw new Error("App not found");
	}

	const slack = new WebClient(app.metadata.accessToken);

	const channelInfo = await slack.conversations.info({
		channel: metadata.channelId,
	});

	const channelDescription = {
		name: channelInfo.channel?.name as string,
		topic: channelInfo.channel?.topic?.value as string,
		purpose: channelInfo.channel?.purpose?.value as string,
	};

	const history = await slack.conversations.history({
		channel: metadata.channelId,
		limit: 100,
	});

	const result = await summarizeChannel(
		channelDescription,
		history.messages?.map((message) => message.text as string) ?? [],
	);

	return result;
}
