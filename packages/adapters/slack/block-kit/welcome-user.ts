import { randomElement } from "@proemial/utils/array";

const welcomeMessages = (
	links: [string, string],
	questions: [string, string],
) => [
	`Proem Agent added to channel.\n\nTo show other people what @proem can do, try to post a link: \n${links[0]} [post]\n(or maybe ${links[1]} [post])\n\n...or ask @proem a question:\n${questions[0]} [ask]\n${questions[1]} [ask]`,
];

export function welcomeUser(
	links: [string, string],
	questions: [string, string],
) {
	const text = randomElement(welcomeMessages(links, questions));

	return {
		blocks: [
			{
				type: "section",
				text: {
					type: "mrkdwn",
					text: "Proem Agent added to channel.",
				},
			},
			{
				type: "section",
				text: {
					type: "mrkdwn",
					text: `To show other people what @proem can do, try to post a link: <${links[0]}>`,
				},
				accessory: {
					type: "button",
					text: {
						type: "plain_text",
						text: "Post",
						emoji: true,
					},
					value: links[0],
					action_id: "post_link",
				},
			},
			// {
			// 	type: "section",
			// 	text: {
			// 		type: "mrkdwn",
			// 		text: `(or maybe ${links[1]})`,
			// 	},
			// 	accessory: {
			// 		type: "button",
			// 		text: {
			// 			type: "plain_text",
			// 			text: "Post",
			// 			emoji: true,
			// 		},
			// 		value: links[1],
			// 		action_id: "post_link_button",
			// 	},
			// },
			{
				type: "section",
				text: {
					type: "mrkdwn",
					text: `...or ask @proem a question: "${questions[0]}"`,
				},
				accessory: {
					type: "button",
					text: {
						type: "plain_text",
						text: "Ask",
						emoji: true,
					},
					value: questions[0],
					action_id: "ask_question",
				},
			},
			// {
			// 	type: "section",
			// 	text: {
			// 		type: "mrkdwn",
			// 		text: `"${questions[1]}"`,
			// 	},
			// 	accessory: {
			// 		type: "button",
			// 		text: {
			// 			type: "plain_text",
			// 			text: "Ask",
			// 			emoji: true,
			// 		},
			// 		value: questions[1],
			// 		action_id: "ask_question_button",
			// 	},
			// },
		],
	};
}
