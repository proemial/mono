import { getOaPaperSearchUrl } from "./oa-identifier";

describe("oaPaperUrl()", () => {
	it("can match doi", () => {
		const identifier = identifiers[0];
		expect(getOaPaperSearchUrl(identifier?.id as string)).toEqual(
			identifier?.url,
		);
	});
	it("can match doi url", () => {
		const identifier = identifiers[1];
		expect(getOaPaperSearchUrl(identifier?.id as string)).toEqual(
			identifier?.url,
		);
	});

	it("can match arXiv id", () => {
		const identifier = identifiers[2];
		expect(getOaPaperSearchUrl(identifier?.id as string)).toEqual(
			identifier?.url,
		);
	});
	it("can match versioned arXiv id", () => {
		const identifier = identifiers[3];
		expect(getOaPaperSearchUrl(identifier?.id as string)).toEqual(
			identifier?.url,
		);
	});
	it("can match arXiv url", () => {
		const identifier = identifiers[4];
		expect(getOaPaperSearchUrl(identifier?.id as string)).toEqual(
			identifier?.url,
		);
	});
	it("can match versioned arXiv url", () => {
		const identifier = identifiers[5];
		expect(getOaPaperSearchUrl(identifier?.id as string)).toEqual(
			identifier?.url,
		);
	});

	it("can match pubmed url", () => {
		const identifier = identifiers[6];
		expect(getOaPaperSearchUrl(identifier?.id as string)).toEqual(
			identifier?.url,
		);
	});
});

const identifiers = [
	{
		id: "10.1109/5.771073",
		url: "https://api.openalex.org/autocomplete?q=10.1109/5.771073",
	},
	{
		id: "https://doi.org/10.1109/5.771073",
		url: "https://api.openalex.org/autocomplete?q=https://doi.org/10.1109/5.771073",
	},
	{
		id: "0706.1234",
		url: "https://api.openalex.org/works?filter=locations.landing_page_url:http://arxiv.org/abs/0706.1234|https://arxiv.org/abs/0706.1234",
	},
	{
		id: "0706.1234v1",
		url: "https://api.openalex.org/works?filter=locations.landing_page_url:http://arxiv.org/abs/0706.1234|https://arxiv.org/abs/0706.1234",
	},
	{
		id: "https://arxiv.org/abs/0706.1234",
		url: "https://api.openalex.org/works?filter=locations.landing_page_url:http://arxiv.org/abs/0706.1234|https://arxiv.org/abs/0706.1234",
	},
	{
		id: "http://arxiv.org/abs/0706.1234v1",
		url: "https://api.openalex.org/works?filter=locations.landing_page_url:http://arxiv.org/abs/0706.1234|https://arxiv.org/abs/0706.1234",
	},
	{
		id: "https://pubmed.ncbi.nlm.nih.gov/12345678",
		url: "https://api.openalex.org/works?filter=ids.pmid:https://pubmed.ncbi.nlm.nih.gov/12345678",
	},
];
