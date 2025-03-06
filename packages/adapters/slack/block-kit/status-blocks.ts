import { Colors } from "./colors";

export function status(target: string, text: string, error?: boolean) {
	const preloader = target === "annotate" && !error;

	const spinner = {
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
	};

	if (!preloader) {
		return {
			blocks: [spinner],
		};
	}

	return {
		attachments: [
			{
				color: error ? Colors.RED : Colors.GREEN,
				blocks: [
					{
						...spinner,
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
