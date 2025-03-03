export function nudge(clientId: string, teamId: string) {
	const text =
		"Hello Coworker! I’m @proem, the new knowledge assistant for this channel. I can enrich the messages, links, and files you share in Slack, and answer your questions.";
	const okButtonText = "Sounds Great!";
	const cancelButtonText = "Not right now";

	const url = [
		"https://slack.com/oauth/v2/authorize?user_scope=chat:write",
		`client_id=${clientId}`,
		`team=${teamId}`,
	].join("&");

	return {
		attachments: [
			{
				color: "#66ff66",
				blocks: [
					{
						type: "section",
						text: {
							type: "mrkdwn",
							text,
						},
					},
					{
						type: "actions",
						elements: [
							{
								type: "button",
								text: {
									type: "plain_text",
									text: okButtonText,
								},
								style: "primary",
								action_id: "nudge_accept",
								url,
							},
							{
								type: "button",
								text: {
									type: "plain_text",
									text: cancelButtonText,
								},
								action_id: "nudge_reject",
							},
						],
					},
				],
			},
		],
	};
}
