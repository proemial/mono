export function link(text: string, url?: string, title?: string) {
	return {
		attachments: [
			{
				color: "#66ff66",
				blocks: [
					// @brian here you go
					// {
					// 	type: "image",
					// 	image_url:
					// 		"https://clan.fastly.steamstatic.com/images/44723649/0eb8e11277c7460f9012e992a9f91afb97cd752f.jpg",
					// 	alt_text: "Open Graph image",
					// },
					{
						type: "context",
						elements: [
							{
								type: "image",
								image_url: "https://assistant.proem.ai/slack/proem-icon.png",
								alt_text: "",
							},
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
