export function link(text: string, url?: string, title?: string) {
	return {
		attachments: [
			{
				color: "#66ff66",
				blocks: [
					{
						type: "context",
						elements: [
							{
								type: "mrkdwn",
								text: "*summary*",
							},
							{
								type: "mrkdwn",
								text: text,
							},
						],
					},
					// Followups @brian
					// {
					// 	type: "actions",
					// 	elements: [
					// 		{
					// 			type: "static_select",
					// 			placeholder: {
					// 				type: "plain_text",
					// 				text: "Ask question",
					// 				emoji: true,
					// 			},
					// 			options: [
					// 				{
					// 					text: {
					// 						type: "plain_text",
					// 						text: "First followup questions",
					// 						emoji: true,
					// 					},
					// 					value: "value-0",
					// 				},
					// 				{
					// 					text: {
					// 						type: "plain_text",
					// 						text: "Second followup question",
					// 						emoji: true,
					// 					},
					// 					value: "value-1",
					// 				},
					// 				{
					// 					text: {
					// 						type: "plain_text",
					// 						text: "Third followup question",
					// 						emoji: true,
					// 					},
					// 					value: "value-2",
					// 				},
					// 				{
					// 					text: {
					// 						type: "plain_text",
					// 						text: "↔️ Tell me more",
					// 						emoji: true,
					// 					},
					// 					value: "value-3",
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
