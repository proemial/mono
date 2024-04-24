export const toTitleCaseIfAllCaps = (title: string) =>
	isMostlyAllCaps(title) ? toTitleCase(title) : title;

/**
 * Returns `true` if the number of uppercase characters in the string is greater
 * than 80% of the total characters.
 */
const isMostlyAllCaps = (str: string) => {
	const threshold = 0.8;
	const noOfUppercaseChars = str
		.split("")
		.filter((c) => c === c.toUpperCase()).length;
	return noOfUppercaseChars / str.length > threshold;
};

const toTitleCase = (title: string) => {
	const exceptions = [
		"a",
		"an",
		"and",
		"as",
		"at",
		"but",
		"by",
		"for",
		"of",
		"over",
		"the",
		"to",
	];
	const titleCase = title
		.toLowerCase()
		// Capitalize each word
		.split(" ")
		.map((word) =>
			exceptions.includes(word) ? word : word[0]?.toUpperCase() + word.slice(1),
		)
		.join(" ")
		// Capitalize first word after a question
		.split("?")
		.map(
			(sentence) =>
				sentence.trim()[0]?.toUpperCase() + sentence.trim().slice(1),
		)
		.join("? ")
		.trim();
	return titleCase[0]?.toUpperCase() + titleCase.slice(1);
};
