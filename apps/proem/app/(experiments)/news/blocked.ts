export function isBlockedUrl(url: string) {
	if (url.includes("facebook.com") || url.includes("fb.com")) {
		return "We cannot make it past the Facebook login wall 😔";
	}
	if (url.includes("instagram.com")) {
		return "We cannot make it past the Instagram login wall 😔";
	}
	if (url.includes("twitter.com") || url.includes("x.com")) {
		return "We cannot make it past the Twitter/X login wall 😔";
	}
	if (url.includes("youtube.com") || url.includes("youtu.be")) {
		return "We currently do not support YouTube videos 😔";
	}
	return undefined;
}
