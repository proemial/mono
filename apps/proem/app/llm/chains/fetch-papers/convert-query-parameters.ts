export function convertToOASearchString(title: string, abstract: string[]) {
	const query = `title.search:("${title}"),abstract.search:(${abstract
		.map((abstract) => `"${abstract}"`)
		.join(" OR ")})`;

	return encodeURIComponent(query);
}
