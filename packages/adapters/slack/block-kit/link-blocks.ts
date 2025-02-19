export function link(text: string, title?: string) {
	return {
		attachments: [
			{
				...(title && {
					pretext: `*${title}*`,
					mrkdwn_in: ["pretext"],
				}),
				color: "#7DFA85",
				text,
			},
		],
	};
}
