export const isTwitterUrl = (url: string) => {
	const urlObj = new URL(url);
	return (
		urlObj.hostname.includes("twitter.com") || urlObj.hostname.includes("x.com")
	);
};
