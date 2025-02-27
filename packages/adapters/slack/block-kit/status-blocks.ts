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
								image_url: "https://assistant.proem.ai/slack/spinner.gif",
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
									image_url: "https://assistant.proem.ai/slack/preloader.gif",
									alt_text: "Preloader",
								},
							]),
				],
			},
		],
	};
}
