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
					text: "Thanks for adding me. Show everyone how I work by posting a link:",
				},
			},
			// @brian
			// {
			// 	type: "image",
			// 	image_url: "https://chat.proem.ai/images/post-image.gif",

			// 	alt_text: "Proem image",
			// },
			{
				type: "section",
				text: {
					type: "mrkdwn",
					text: `Paper: <${links[0]}>`,
				},
				accessory: {
					type: "button",
					text: {
						type: "plain_text",
						text: "Post Link",
						emoji: true,
					},
					value: links[0],
					action_id: "post_link",
				},
			},
			// @brian
			// {
			// 	type: "section",
			// 	text: {
			// 		type: "mrkdwn",
			// 		text: "*AI-Powered Data Interaction: A Natural Language Chatbot for CSV...*\n<https://irojournals.com/itdw/article/view/7/1/1>",
			// 	},
			// 	accessory: {
			// 		type: "button",
			// 		text: {
			// 			type: "plain_text",
			// 			text: "Post Link",
			// 			emoji: true,
			// 		},
			// 		value: links[0],
			// 		action_id: "post_link",
			// 	},
			// },
			// {
			// 	type: "section",
			// 	text: {
			// 		type: "mrkdwn",
			// 		text: "*Just-in-Time News: An AI Chatbot for the Modern Information Age*\n<https://www.mdpi.com/2673-2688/6/2/22>",
			// 	},
			// 	accessory: {
			// 		type: "button",
			// 		text: {
			// 			type: "plain_text",
			// 			text: "Post Link",
			// 			emoji: true,
			// 		},
			// 		value: links[0],
			// 		action_id: "post_link",
			// 	},
			// },
			// {
			// 	type: "section",
			// 	text: {
			// 		type: "mrkdwn",
			// 		text: " *Design and Research of Intelligent Chatbot for Campus Information...*\n<https://onlinelibrary.wiley.com/doi/10.1002/eng2.70072>",
			// 	},
			// 	accessory: {
			// 		type: "button",
			// 		text: {
			// 			type: "plain_text",
			// 			text: "Post Link",
			// 			emoji: true,
			// 		},
			// 		value: links[0],
			// 		action_id: "post_link",
			// 	},
			// },
		],
	};
}
