import { QdrantPaperPayload } from "./qdrant.model";

export function sanitizePaper(paper: QdrantPaperPayload): QdrantPaperPayload {
	const removed = {} as { [key: string]: number | undefined };

	const [authorships, addAuth] = slice(paper.authorships, 20);
	if (addAuth) {
		removed.authorships = addAuth;
	}
	const [locations, addLoc] = slice(paper.locations, 20);
	if (addLoc) {
		removed.locations = addLoc;
	}
	const [referenced_works, addRef] = slice(paper.referenced_works, 20);
	if (addRef) {
		removed.referenced_works = addRef;
	}
	const [related_works, addRel] = slice(paper.related_works, 20);
	if (addRel) {
		removed.related_works = addRel;
	}

	const sanitizedPaper = {
		...paper,
		locations,
		authorships,
		referenced_works,
		related_works,
	};

	if (Object.keys(removed).length) {
		sanitizedPaper.removed = removed;
	}

	const arxivId = getArXivid(paper);
	if (arxivId) {
		sanitizedPaper.ids.arxiv = arxivId;
	}

	return sanitizedPaper;
}

export function getArXivid(paper: QdrantPaperPayload) {
	const arxivLocation = paper.locations.find((location) =>
		location.landing_page_url?.toLocaleLowerCase().includes("arxiv.org"),
	);

	if (arxivLocation) {
		const sanitizedId = arxivLocation.landing_page_url.replace(
			"http://",
			"https://",
		);

		return sanitizedId;
	}
}

function slice<T>(array: T[], count: number): [T[], number | undefined] {
	const sliced = array.slice(0, count);
	const removed = array.length - sliced.length;

	return [sliced, removed > 0 ? removed : undefined];
}
