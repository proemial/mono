import { nudgeMessage } from "../nudge-messages";

export function welcome(channelName: string) {
	const text = nudgeMessage
		.welcomeToChannel()
		?.replace("{channel}", channelName) as string;

	return {
		blocks: [
			{
				type: "section",
				text: {
					type: "mrkdwn",
					text,
				},
			},
		],
	};
}
