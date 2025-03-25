import { SlackMessenger } from "../slack-messenger";

export function link(
	text: string,
	url: string,
	title?: string,
	questions?: Array<{ question: string; answer: string }>,
) {
	return {
		blocks: [],
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
									// @ts-ignore This seems to work, even though the type is wrong
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
													text:
														// Slack has a max size of 76 characters
														question.question.length > 76
															? `${question.question.slice(0, 71)}...?`
															: question.question,
													emoji: true,
												},
												value: question.question,
											})),
											action_id: "followup-question",
										},
										{
											type: "button",
											text: {
												type: "plain_text",
												text: "Related Content",
												emoji: true,
											},
											value: url,
											action_id: "related-content",
										},
									],
								},
							]
						: []),
				],
			},
		],
	} satisfies Parameters<typeof SlackMessenger.sendMessageResponse>[1];
}
