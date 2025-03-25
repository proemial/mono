export function relatedContent(attachments: string[], papers: string[]) {
	return {
		title: {
			type: "plain_text",
			text: "Related Content",
			emoji: true,
		},
		submit: {
			type: "plain_text",
			text: "Submit",
		},
		type: "modal",
		close: {
			type: "plain_text",
			text: "Close",
			emoji: true,
		},
		blocks: [
			...(attachments.length > 0
				? [
						{
							type: "section",
							text: {
								type: "mrkdwn",
								text: "*Related Channel Content*",
							},
						},
						{
							type: "divider",
						},
						...attachments.map((attachmentMrkDwn) => ({
							type: "section",
							text: {
								type: "mrkdwn",
								text: attachmentMrkDwn,
							},
						})),
					]
				: []),
			...(papers.length > 0
				? [
						{
							type: "section",
							text: {
								type: "mrkdwn",
								text: "*Research Papers*",
							},
						},
						{
							type: "divider",
						},
						...papers.map((paperMrkDwn) => ({
							type: "section",
							text: {
								type: "mrkdwn",
								text: paperMrkDwn,
							},
						})),
					]
				: []),
		],
	};
}
