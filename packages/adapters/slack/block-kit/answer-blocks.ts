export function answer(text: string, url?: string, title?: string) {
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
	};
}
