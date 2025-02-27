export function answer(text: string, url?: string, title?: string) {
	return {
		attachments: [
			{
				fallback: text,
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
