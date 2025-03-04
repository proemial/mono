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
				],
			},
		],
	};
}
