export const URL_BLACKLIST = [
	// Remove Slack workspace URLs
	/https?:\/\/[^\/]+\.slack\.com\//,
	// Google Docs
	/https?:\/\/docs\.google\.com\//,
	// Remove Jam.dev conversation URLs
	/https?:\/\/jam\.dev\/c\/.*/,
];
