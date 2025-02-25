export function link(text: string, url?: string, title?: string) {
	return {
		attachments: [
			{
				color: "#00ff00",
				blocks: [
					{
						type: "context",
						elements: [
							{
								type: "mrkdwn",
								text: "*proem summary*",
							},
							{
								type: "mrkdwn",
								text: url && title ? `*<${url}|${title}>*\n${text}` : text,
							},
						],
					},
				],
			},
		],
	};
}
