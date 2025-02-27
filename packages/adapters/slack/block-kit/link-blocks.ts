export function link(text: string, url?: string, title?: string) {
	return {
		attachments: [
			{
				color: "#66ff66",
				blocks: [
					{
						type: "context",
						elements: [
							{
								type: "image",
								image_url: "https://assistant.proem.ai/slack/proem-icon.png",
								alt_text: "Logo",
							},
							{
								type: "mrkdwn",
								text: "*summary*",
							},
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
