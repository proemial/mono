import { toOpenAlexPapers } from "../transform/to-open-alex";

export async function fetchFromArxiv(id: string) {
	const response = await fetch(
		`https://export.arxiv.org/api/query?id_list=${id}`,
	);
	const xml = await response.text();
	const papers = toOpenAlexPapers(xml);

	return papers.at(0);
}
