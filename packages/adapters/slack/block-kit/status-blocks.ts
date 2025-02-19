export function status(text: string) {
	return {
		attachments: [
			{
				text: text,
			},
		],
	};
}
