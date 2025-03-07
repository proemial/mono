export function link(
	text: string,
	title?: string,
	questions?: Array<{ question: string; answer: string }>,
) {
	return {
		attachments: [
			{
				color: "#66ff66",
				blocks: [
					{
						type: "context",
						elements: [
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
					...(questions?.length
						? [
								{
									type: "actions",
									block_id: "followups",
									elements: [
										{
											type: "static_select",
											placeholder: {
												type: "plain_text",
												text: "Ask question",
												emoji: true,
											},
											options: questions.slice(0, 3).map((question) => ({
												text: {
													type: "plain_text",
													text: question.question,
													emoji: true,
												},
												value: question.question,
											})),
											action_id: "followup-question",
										},
									],
								},
							]
						: []),
				],
			},
		],
	};
}
