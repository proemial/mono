import { fetchJson } from "@proemial/utils/fetch";

export type Institution = {
	id: string;
	display_name: string;
	works_count: number;
	counts_by_year: Record<string, number>[];
};

type InstitutionResponse = {
	results: Institution[];
};

export async function fetchInstitutions(institution: string) {
	const institutions = (
		await fetchJson<InstitutionResponse>(
			`https://api.openalex.org/institutions?filter=display_name.search:${institution}&select=id,display_name,works_count,counts_by_year`,
		)
	).results.sort((a, b) => b.works_count - a.works_count);

	return institutions;
}
