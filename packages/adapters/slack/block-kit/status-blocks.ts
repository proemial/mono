import { Colors } from "../ui-updates/colors";
import { SlackV2MessageTarget } from "../../mongodb/slack/v2.models";

export function status(
	target: SlackV2MessageTarget,
	text: string,
	error?: boolean,
) {
	const preloader = target.target === "annotate" && !error;
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
					...(preloader
						? [
								{
									type: "image",
									image_url: "https://assistant.proem.ai/slack/preloader.gif",
									alt_text: "Preloader",
								},
							]
						: []),
				],
			},
		],
	};
}
