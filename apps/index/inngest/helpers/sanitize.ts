import { IndexedPaper } from "./paper.model";

export function sanitizePaper(paper: IndexedPaper) {
	const removed = {} as { [key: string]: number | undefined };

	const [authorships, addAuth] = slice(paper.data.authorships, 20);
	if (addAuth) {
		removed.authorships = addAuth;
	}
	const [locations, addLoc] = slice(paper.data.locations, 20);
	if (addLoc) {
		removed.locations = addLoc;
	}
	const [referenced_works, addRef] = slice(paper.data.referenced_works, 20);
	if (addRef) {
		removed.referenced_works = addRef;
	}
	const [related_works, addRel] = slice(paper.data.related_works, 20);
	if (addRel) {
		removed.related_works = addRel;
	}

	const sanitizedPaper = {
		...paper,
		data: {
			...paper.data,
			locations,
			authorships,
			referenced_works,
			related_works,
		},
	};

	if (Object.keys(removed).length) {
		sanitizedPaper.data.removed = removed;
	}

	const arxivId = getArXivid(paper);
	if (arxivId) {
		sanitizedPaper.data.ids.arxiv = arxivId;
	}

	return sanitizedPaper;
}

function getArXivid(paper: IndexedPaper) {
	const arxivLocation = paper.data.locations.find((location) =>
		location.landing_page_url.toLocaleLowerCase().includes("arxiv.org"),
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
