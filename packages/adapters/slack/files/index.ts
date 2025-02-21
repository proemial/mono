export const isSlackFileUrl = (url: string) => {
	const urlObj = new URL(url);
	return (
		urlObj.hostname.includes("slack.com") && urlObj.pathname.includes("files")
	);
};

export const fetchSlackFile = async (
	url: string,
	token: string,
	mimetype: string,
) => {
	const filename = url.split("/").pop();
	if (!filename) {
		throw new Error("File name missing");
	}
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	const file = await response.blob();
	return new File([file], filename, { type: mimetype });
};
