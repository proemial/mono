import { Colors } from "../ui-updates/colors";

export function status(target: string, text: string, error?: boolean) {
	const preloader = target === "annotate" && !error;
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
								alt_text: "",
							},
							{
								type: "mrkdwn",
								text: text,
							},
						],
					},
					...(preloader
						? [
								{
									type: "image",
									image_url: "https://assistant.proem.ai/slack/preloader.gif",
									alt_text: "",
								},
							]
						: []),
				],
			},
		],
	};
}
