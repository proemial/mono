import { Colors } from "../ui-updates/colors";

export function status(text: string, error?: boolean) {
	return {
		attachments: [
			{
				color: error ? Colors.RED : Colors.GREEN,
				blocks: [
					{
						type: "context",
						elements: [
							{
								type: "image",
								image_url: "https://u.lillefar.dk/i/HGTyaq+",
								alt_text: "Logo",
							},
							{
								type: "mrkdwn",
								text: text,
							},
						],
					},
					...(error
						? []
						: [
								{
									type: "image",
									image_url: "https://u.lillefar.dk/i/I0Q03K+",
									alt_text: "Preloader",
								},
							]),
				],
			},
		],
	};
}
