import {
	expandedSynonymGroups,
	singularSynonyms,
	singularSynonymsNoVerbs,
	synonymGroups,
	uniqueUnigrams,
} from "./search-params-helpers";

const extractedSynonymGroups = [
	["solar power", "solar energy", "photovoltaic power", "solar panels"],
	["nuclear power", "nuclear energy", "atomic power", "fission energy"],
	["~better", "~superior", "~more effective", "~preferable"],
	[
		"CO2 emissions",
		"carbon dioxide emissions",
		"greenhouse gas emissions",
		"carbon footprint",
	],
];

describe("search-params-helpers", () => {
	it("synonymGroups() build query with search groups from array", () => {
		expect(synonymGroups(extractedSynonymGroups)).toEqual(
			`("solar power" OR "solar energy" OR "photovoltaic power" OR "solar panels") AND ("nuclear power" OR "nuclear energy" OR "atomic power" OR "fission energy") AND ("better" OR "superior" OR "more effective" OR "preferable") AND ("CO2 emissions" OR "carbon dioxide emissions" OR "greenhouse gas emissions" OR "carbon footprint")`,
		);
	});

	it("singularSynonyms() build query by expanding the groups", () => {
		expect(singularSynonyms(extractedSynonymGroups)).toEqual(
			`"solar power" OR "solar energy" OR "photovoltaic power" OR "solar panels" OR "nuclear power" OR "nuclear energy" OR "atomic power" OR "fission energy" OR "better" OR "superior" OR "more effective" OR "preferable" OR "CO2 emissions" OR "carbon dioxide emissions" OR "greenhouse gas emissions" OR "carbon footprint"`,
		);
	});

	it("singularSynonymsNoVerbs() build query by expanding the groups, umitting verbs", () => {
		expect(singularSynonymsNoVerbs(extractedSynonymGroups)).toEqual(
			`"solar power" OR "solar energy" OR "photovoltaic power" OR "solar panels" OR "nuclear power" OR "nuclear energy" OR "atomic power" OR "fission energy" OR "CO2 emissions" OR "carbon dioxide emissions" OR "greenhouse gas emissions" OR "carbon footprint"`,
		);
	});

	it("uniqueUnigrams() build query by expanding the groups, removing duplicates", () => {
		expect(uniqueUnigrams(extractedSynonymGroups)).toEqual(
			`"solar" OR "power" OR "energy" OR "photovoltaic" OR "panels" OR "nuclear" OR "atomic" OR "fission" OR "better" OR "superior" OR "more" OR "effective" OR "preferable" OR "CO2" OR "emissions" OR "carbon" OR "dioxide" OR "greenhouse" OR "gas" OR "footprint"`,
		);
	});

	it("expandedSynonymGroups() collapse tha last two groups", () => {
		expect(expandedSynonymGroups(extractedSynonymGroups)).toEqual(
			`("solar power" OR "solar energy" OR "photovoltaic power" OR "solar panels") AND ("nuclear power" OR "nuclear energy" OR "atomic power" OR "fission energy") AND ("better" OR "superior" OR "more effective" OR "preferable" OR "CO2 emissions" OR "carbon dioxide emissions" OR "greenhouse gas emissions" OR "carbon footprint")`,
		);
	});
});
