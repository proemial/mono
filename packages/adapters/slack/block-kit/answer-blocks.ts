export function answer(text: string, url?: string, title?: string) {
	return {
		blocks: [
			{
				type: "section",
				text: {
					type: "mrkdwn",
					text: "*answer*",
				},
			},
		],
		attachments: [
			{
				color: "#66ff66",
				blocks: [
					{
						type: "context",
						elements: [
							{
								type: "mrkdwn",
								text: text,
							},
						],
					},
				],
			},
		],
	};
}
