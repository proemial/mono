export function splitAndSanitize(text: string) {
	let index = 0;

	return (
		text
			// Remove leading hyphen.
			.replace(/^\s*-\s*/gm, "")

			// [#1], [#2], [#3] > [1], [2], [3]
			.replace(/\[#(\d+)\]/g, "[$1]")

			// [#], [#], [#] > [1], [2], [3]
			.replace("[#]", () => `[${++index}]`)

			// split into segments retaining matched patterns as separate segments
			.split(/(\[.*?\])/)
	);
}
