export function welcomeUser(links: { url: string; title: string }[]) {
	return {
		blocks: [
			{
				type: "section",
				text: {
					type: "mrkdwn",
					text: "Thanks for adding me. Show everyone how I work by posting a link:",
				},
			},
			// {
			// 	type: "image",
			// 	image_url: "https://assistant.proem.ai/images/post-image.gif",

			// 	alt_text: "Proem image",
			// },
			...links.map((link, index) => ({
				type: "section",
				text: {
					type: "mrkdwn",
					text: `*${link.title.length > 40 ? `${link.title.slice(0, 37)}...` : link.title}*\n<${link.url}>`,
				},
				accessory: {
					type: "button",
					text: {
						type: "plain_text",
						text: "Post Link",
						emoji: true,
					},
					value: link.url,
					action_id: "post_link",
				},
			})),
		],
	};
}
