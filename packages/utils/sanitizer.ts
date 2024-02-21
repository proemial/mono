const regex = /#[A-Za-z0-9_]+\b/g;

export function sanitize(text?: string) {
	const str = text || "";
	const hashtags = str?.match(regex) || [];
	// const sanitized = str?.replace(regex, '').trim();

	const unQuote = (s?: string) => s?.replace(/^"(.*)"$/, "$1");

	const words = unQuote(str)?.split(" ");
	const sanitized = words
		?.map((word, i) => {
			const match = word.match(regex);

			if (!match) return word;

			return isLastish(i, words)
				? // TODO: Keep trailing stop characters
				  "" //word.replace(/.*([,.!?])$/, '$1')
				: word.replace("#", "");
		})
		.join(" ")
		.trim()
		.replace(/^"(.*)"$/, "$1");

	return {
		sanitized: unQuote(sanitized),
		hashtags,
	};
}

export function isLastish(i: number, words: string[]) {
	return (
		i === words.length - 1 ||
		(i < words.length - 1 &&
			// @ts-ignore
			words[i + 1].match(regex) &&
			!words.slice(i + 1).find((w) => !w.match(regex)))
	);
}
