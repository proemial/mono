import { statusMessages } from "../helpers/status-messages";

export function debug(text: string) {
	return {
		blocks: [
			{
				type: "context",
				elements: [
					{
						type: "mrkdwn",
						text: `${statusMessages.debug.prefix} \`\`\`${text}\`\`\``,
					},
				],
			},
		],
	};
}
