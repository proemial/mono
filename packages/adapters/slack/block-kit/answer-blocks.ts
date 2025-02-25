export function answer(text: string, url?: string, title?: string) {
	if (url && title) {
		return {
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
		};
	}

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
