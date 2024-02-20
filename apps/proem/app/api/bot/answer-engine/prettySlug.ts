/**
 * Prettifies a random slug based on the user's question.
 * @example prettySlug("Hello World") //> "hello-world-<randomID>"
 */
export function prettySlug(str: string) {
	const trimmedInput = str
		.trim()
		.toLowerCase()
		// Remove all commas and periods for a cleaner slug
		.replaceAll(",", "")
		.replaceAll(".", "")
		.replaceAll(" ", "-")
		.substring(0, 12);

	const randomId = crypto.randomUUID().replaceAll("-", "").substring(0, 22);

	return `${encodeURIComponent(trimmedInput)}-${randomId}`.replaceAll(
		"--",
		"-",
	);
}
