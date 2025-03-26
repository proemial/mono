import { statusMessages } from "../helpers/status-messages";
import { SlackEventMetadata } from "../models/metadata-models";

export function debug(metadata: SlackEventMetadata, text: string) {
	return {
		blocks: [
			{
				type: "section",
				text: {
					type: "mrkdwn",
					text: `${statusMessages.debug.prefix} ${text ? `\`\`\`${text}\`\`\`` : ""}`,
				},
				accessory: {
					type: "button",
					text: {
						type: "plain_text",
						text: "Debug 🐛",
						emoji: true,
					},
					url: `http://127.0.0.1:6262/slack/debug?metadata=${encodeURIComponent(
						JSON.stringify(metadata),
					)}`,
					action_id: "debug_link",
				},
			},
		],
	};
}
