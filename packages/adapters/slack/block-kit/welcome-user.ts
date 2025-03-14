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
					text,
				},
			},
		],
	};
}
