import { Colors } from "../ui-updates/colors";

export function status(text: string, error?: boolean) {
	return {
		attachments: [
			{
				color: error ? Colors.RED : Colors.GREEN,
				text: text,
			},
		],
	};
}
