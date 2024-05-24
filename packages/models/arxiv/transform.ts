import { XMLParser } from "fast-xml-parser";
import { RawArxivPaper } from "./arxiv-atom";
import { OpenAlexPaperWithAbstract } from "../open-alex";

export async function fetchFromArxiv(id: string) {
	const response = await fetch(
		`https://export.arxiv.org/api/query?id_list=${id}`,
	);
	const xml = await response.text();
	const papers = toOpenAlexPapers(xml);

	return papers.at(0);
}

export function toOpenAlexPapers(xml: string): OpenAlexPaperWithAbstract[] {
	const arxivPapers = fromXml(xml);

	const result = arxivPapers.map((paper) => ({
		id: paper.id,
		title: paper.title,
		display_name: paper.title,
		abstract: paper.summary,
		publication_date: paper.published.substring(0, 10),
		publication_year: Number.parseInt(paper.published.substring(0, 4)),
		ids: { arxiv: paper.id },
		authorships: Array.isArray(paper.author)
			? paper.author.map((author) => ({
					author: { display_name: author.name },
				}))
			: [{ author: { display_name: paper.author.name } }],
		primary_location: asLocation(paper),
		locations: [asLocation(paper)],
		best_oa_location: asLocation(paper),

		language: "en",
		has_fulltext: true,
		related_works: [],
		open_access: {
			is_oa: true,
			oa_status: "unknown",
			oa_url: paper.link.find((link) => link.type === "text/html")?.href ?? "",
			any_repository_has_fulltext: true,
		},
		updated_date: paper.updated,
	}));

	return result;
}

function asLocation(paper: RawArxivPaper) {
	const base = {
		is_oa: true,
		source: {
			id: "https://openalex.org/S4306400194",
			display_name: "arXiv (Cornell University)",
			is_oa: true,
			host_organization: "https://openalex.org/I205783295",
			host_organization_name: "Cornell University",
			type: "repository",
		},
		license: "",
		version: "publishedVersion",
		is_published: true,
	};

	return {
		...base,
		landing_page_url:
			paper.link.find((link) => link.type === "text/html")?.href ?? "",
		pdf_url:
			paper.link.find((link) => link.type === "application/pdf")?.href ?? "",
	};
}

export function fromXml(xml: string) {
	const parser = new XMLParser({
		ignoreAttributes: false,
		attributeNamePrefix: "",
		allowBooleanAttributes: true,
		removeNSPrefix: true,
	});

	const json = parser.parse(xml);
	if (!Array.isArray(json.feed.entry)) {
		return [json.feed.entry] as Array<RawArxivPaper>;
	}

	return json.feed.entry as Array<RawArxivPaper>;
}
