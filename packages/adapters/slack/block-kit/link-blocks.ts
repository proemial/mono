export function link(
	text: string,
	summary: string,
	url?: string,
	title?: string,
) {
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
				type: "context",
				elements: [
					{
						type: "image",
						image_url: "https://u.lillefar.dk/i/VWARSX+",
						alt_text: "cute cat",
					},
					{
						type: "plain_text",
						text: url ? "summary" : "answer",
						emoji: true,
					},
				],
			},
		],
		attachments: [
			{
				color: "#7DFA85",
				blocks: [
					{
						type: "section",
						text: {
							type: "mrkdwn",
							text: url && title ? `*<${url}|${title}>*\n${summary}` : summary,
						},
					},
					// {
					// 	type: "actions",
					// 	elements: [
					// 		{
					// 			type: "static_select",
					// 			placeholder: {
					// 				type: "plain_text",
					// 				text: "Follow-up questions",
					// 				emoji: true,
					// 			},
					// 			options: [
					// 				{
					// 					text: {
					// 						type: "plain_text",
					// 						text: "What is the purpose of the Data.gov Archive?",
					// 						emoji: true,
					// 					},
					// 					value: "value-0",
					// 				},
					// 				{
					// 					text: {
					// 						type: "plain_text",
					// 						text: "What other projects does this build on?",
					// 						emoji: true,
					// 					},
					// 					value: "value-1",
					// 				},
					// 				{
					// 					text: {
					// 						type: "plain_text",
					// 						text: "Who is funding this project?",
					// 						emoji: true,
					// 					},
					// 					value: "value-2",
					// 				},
					// 			],
					// 			action_id: "static_select-action",
					// 		},
					// 	],
					// },
				],
			},
		],
	};
}
