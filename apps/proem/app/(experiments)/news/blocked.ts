export function isBlockedUrl(url: string) {
	if (url.includes("facebook.com") || url.includes("fb.com")) {
		return "We cannot make it past the Facebook login wall 😔";
	}
	return undefined;
}
