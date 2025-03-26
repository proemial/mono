export const statusMessages = {
	annotate: {
		begin: "reading...",
		summarize: "writing summary...",
	},
	ask: {
		begin: "analyzing question...",
		fetch: "looking for research...",
		summarize: "thinking...",
		searchChannelAttachments: "searching channel attachments...",
	},
	debug: {
		prefix: ":proem: LLM debug page:",
	},
};

export const isStatusMessage = (message: string) => {
	return (
		Object.values(statusMessages.annotate).some(
			(status) =>
				message.includes(status) ||
				message.startsWith(statusMessages.debug.prefix),
		) ||
		Object.values(statusMessages.ask).some(
			(status) =>
				message.includes(status) ||
				message.startsWith(statusMessages.debug.prefix),
		)
	);
};
