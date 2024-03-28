export type SynonymGroups = string[][];

const OR = " OR ";
const AND = " AND ";

export function asUrl(title: string, abstract?: string) {
	return encodeURIComponent(
		`title.search:(${title})${
			abstract ? `,abstract.search:(${abstract})` : ""
		}`,
	);
}

export function synonymGroups(groups: SynonymGroups) {
	return groups
		.map((synonyms) => `(${synonyms.map(sanitize).join(OR)})`)
		.join(AND);
}

export function singularSynonyms(groups: SynonymGroups) {
	return groups.map((synonyms) => synonyms.map(sanitize).join(OR)).join(OR);
}

export function singularSynonymsNoVerbs(groups: SynonymGroups) {
	return groups
		.filter((group) => !hasVerbs(group))
		.map((synonyms) => synonyms.map(sanitize).join(OR))
		.join(OR);
}

export function uniqueUnigrams(groups: SynonymGroups) {
	return [...new Set(groups.flat().flatMap((group) => group.split(" ")))]
		.map(sanitize)
		.join(OR);
}

export function expandedSynonymGroups(groups: SynonymGroups) {
	const collapsed = groups.slice(0, -1);
	collapsed[collapsed.length - 1] = [
		...(collapsed[collapsed.length - 1] as []),
		...(groups.at(-1) as []),
	];

	return collapsed
		.map((synonyms) => `(${synonyms.map(sanitize).join(OR)})`)
		.join(AND);
}

// Remove the ~ from verbs, and any commas that might break the query
function sanitize(str: string) {
	return `"${str.replaceAll("~", "").replaceAll(",", "")}"`;
}

function hasVerbs(arr: string[]) {
	return arr.some((str) => str.startsWith("~"));
}
