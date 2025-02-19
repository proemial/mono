export function status(text: string) {
	return {
		attachments: [
			{
				color: "#7DFA85",
				text: text,
			},
		],
	};
}
