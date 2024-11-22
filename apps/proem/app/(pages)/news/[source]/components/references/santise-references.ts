export function splitAndSanitize(text: string) {
	let index = 0;

	return (
		text
			// Remove leading hyphen.
			.replace(/^\s*-\s*/gm, "")

			// [#1], [#2], [#3] > [1], [2], [3]
			.replace(/\[#(\d+)\]/g, "[$1]")

			.split(/(\[.*?\])/)

			// [#], [#], [#] > [1], [2], [3]
			.map((segment, i) => segment.replace("[#]", () => `[${++index}]`))
	);
}
