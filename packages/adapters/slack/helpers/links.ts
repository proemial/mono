export function extractLinks(
	slackText?: string,
	blacklist?: RegExp[],
): string[] {
	// Match all occurrences of <https://...> or <https://...|...>
	const matches = (slackText ?? "").match(/<(https?:\/\/[^|>]+)(?:\|[^>]+)?>/g);

	if (!matches) {
		return [];
	}

	return (
		matches
			// Extract just the URLs from the matches by removing < > and everything after |
			.map((match) => match.replace(/<(https?:\/\/[^|>]+)(?:\|[^>]+)?>/, "$1"))
			// remove blacklisted URLs
			.filter((url) => !blacklist?.some((filter) => url.match(filter)))
	);
}
