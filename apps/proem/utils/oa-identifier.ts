export function getOaPaperSearchUrl(identifier: string) {
	// Pubmed
	if (identifier.toLowerCase().includes("pubmed")) {
		return `https://api.openalex.org/works?filter=ids.pmid:${identifier}`;
	}

	// arXiv
	if (
		identifier.toLowerCase().includes("arxiv") ||
		identifier.match(/.*(\d{4}\.\d{4,5}v?\d*).*/)
	) {
		const match = identifier.match(/.*(\d{4}\.\d{4,5}v?\d*).*/);
		const arxivId = match ? match[1] : identifier;
		return `https://api.openalex.org/works?filter=locations.landing_page_url:http://arxiv.org/abs/${arxivId}|https://arxiv.org/abs/${arxivId}`;
	}

	// DOI
	if (identifier.match(/^10.\d{4,9}\/[-._;()/:A-Z0-9]+$/i)) {
		return `https://api.openalex.org/autocomplete?q=${identifier}`;
	}
	return `https://api.openalex.org/autocomplete?q=${identifier}`;
}
