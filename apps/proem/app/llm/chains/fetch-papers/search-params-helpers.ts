export type SynonymGroups = string[][];

export function asUrl(title: string, abstract?: string) {
	return encodeURIComponent(
		`title.search:(${title})${
			abstract ? `,abstract.search:(${abstract})` : ""
		}`,
	);
}

export function synonymGroups(groups: SynonymGroups) {
	return groups
		.map(
			(synonyms) =>
				`(${synonyms
					.map((synonym) => `"${synonym.replaceAll("~", "")}"`)
					.join(" OR ")})`,
		)
		.join(" AND ");
}

export function singularSynonyms(groups: SynonymGroups) {
	return groups
		.map((synonyms) =>
			synonyms
				.map((synonym) => `"${synonym.replaceAll("~", "")}"`)
				.join(" OR "),
		)
		.join(" OR ");
}

export function singularSynonymsNoVerbs(groups: SynonymGroups) {
	return groups
		.filter((group) => !group.some((synonym) => synonym.startsWith("~")))
		.map((synonyms) =>
			synonyms
				.map((synonym) => `"${synonym.replaceAll("~", "")}"`)
				.join(" OR "),
		)
		.join(" OR ");
}

export function uniqueUnigrams(groups: SynonymGroups) {
	return [...new Set(groups.flat().flatMap((group) => group.split(" ")))]
		.map((word) => `"${word.replaceAll("~", "")}"`)
		.join(" OR ");
}

export function expandedSynonymGroups(groups: SynonymGroups) {
	const collapsed = groups.slice(0, -1);
	collapsed[collapsed.length - 1] = [
		...(collapsed[collapsed.length - 1] as []),
		...(groups.at(-1) as []),
	];

	return collapsed
		.map(
			(synonyms) =>
				`(${synonyms
					.map((synonym) => `"${synonym.replaceAll("~", "")}"`)
					.join(" OR ")})`,
		)
		.join(" AND ");
}
