export function annotatedLink(
	channelId: string,
	threadTs: string,
	summary: string,
) {
	return {
		channel: channelId,
		thread_ts: threadTs,
		unfurl_links: false,
		blocks: [
			{
				type: "section",
				text: {
					type: "mrkdwn",
					text: summary,
				},
				accessory: {
					type: "static_select",
					placeholder: {
						type: "plain_text",
						text: "Actions",
						emoji: true,
					},
					options: [
						{
							text: {
								type: "plain_text",
								text: "Dive deeper",
								emoji: true,
							},
							value: "expand",
						},
						{
							text: {
								type: "plain_text",
								text: "Find relevant research",
								emoji: true,
							},
							value: "expand",
						},
						{
							text: {
								type: "plain_text",
								text: "Follow-up questions",
								emoji: true,
							},
							value: "follow-ups",
						},
						{
							text: {
								type: "plain_text",
								text: "Counter argument",
								emoji: true,
							},
							value: "counter-argument",
						},
					],
					action_id: "actions",
				},
			},
		],
	};
}
