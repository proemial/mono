export const statusMessages = {
	annotate: {
		begin: "scraping...",
		summarize: "thinking...",
	},
	ask: {
		begin: "thinking...",
		fetch: "fetching...",
		summarize: "reasoning...",
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
