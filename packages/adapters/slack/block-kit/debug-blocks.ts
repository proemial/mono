export function debug(text: string) {
	return {
		blocks: [
			{
				type: "context",
				elements: [
					{
						type: "mrkdwn",
						text: `:proem: Debug message: \`\`\`${text}\`\`\``,
					},
				],
			},
		],
	};
}
