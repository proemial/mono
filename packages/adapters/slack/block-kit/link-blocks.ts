export function link(text: string) {
	return {
		attachments: [
			{
				text: text,
			},
		],
	};
}

export function linkOld(channelId: string, threadTs: string, text: string) {
	return {
		channel: channelId,
		thread_ts: threadTs,
		unfurl_links: false,
		blocks: [
			{
				type: "section",
				text: {
					type: "mrkdwn",
					text: text,
				},
			},
		],
	};
}
