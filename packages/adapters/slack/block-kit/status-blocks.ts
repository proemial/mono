export function status(text: string) {
	return {
		attachments: [
			{
				color: "#7DFA85",
				blocks: [
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
								text,
								emoji: true,
							},
						],
					},
				],
			},
		],
	};
}
