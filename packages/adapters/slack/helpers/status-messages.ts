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
};

export const isStatusMessage = (message: string) => {
	return (
		Object.values(statusMessages.annotate).some((status) =>
			message.includes(status),
		) ||
		Object.values(statusMessages.ask).some((status) => message.includes(status))
	);
};
