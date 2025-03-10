export function answer(text: string) {
	return {
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
		attachments: [],
	};
}
