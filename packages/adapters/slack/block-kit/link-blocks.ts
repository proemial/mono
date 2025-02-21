export function link(text: string, url?: string, title?: string) {
	return {
		attachments: [
			{
				color: "#7DFA85",
				blocks: [
					{
						type: "section",
						text: {
							type: "mrkdwn",
							text: url && title ? `*<${url}|${title}>*\n${text}` : text,
						},
					},
				],
			},
		],
	};
}
