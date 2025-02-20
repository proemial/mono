export function nudge(clientId: string, teamId: string) {
	const text = "Please grant access to the assistant to continue";
	const buttonText = "Grant Access";

	const url = [
		"https://slack.com/oauth/v2/authorize?user_scope=chat:write",
		`client_id=${clientId}`,
		`team=${teamId}`,
	].join("&");

	return {
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
							text: buttonText,
						},
						style: "primary",
						url,
					},
				],
			},
		],
	};
}
