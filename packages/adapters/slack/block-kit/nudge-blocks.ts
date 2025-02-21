export function nudge(clientId: string, teamId: string) {
	const text =
		"Personal Summaries explain why your colleagues might want to read the content you share, and why it matters to your team. This also helps your colleagues prioritize what to read...";
	const okButtonText = "Enable Personal Summaries";
	const cancelButtonText = "Not right now";

	const url = [
		"https://slack.com/oauth/v2/authorize?user_scope=chat:write",
		`client_id=${clientId}`,
		`team=${teamId}`,
	].join("&");

	return {
		color: "#7DFA85",
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
	};
}
