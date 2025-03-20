import { randomElement } from "@proemial/utils/array";

const welcomeMessages = (channelName: string) => [
	`Hello, #${channelName} 👋 I’m thrilled to join this channel. 🎉\n\nCount on me to craft concise and insightful summaries of the links and documents you share. I’m also here to tackle any questions you throw my way with enthusiasm and expertise.\n\nDon’t hesitate to tag or DM me @proem—I’m eager to help! 🌟`,
];

export function welcomeAll(channelName: string) {
	const text = randomElement(welcomeMessages(channelName));

	return {
		text,
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
