import { fromXml, toOpenAlexPapers } from "@proemial/models/arxiv/transform";
import { fixtures } from "@/utils/transform.fixture";

describe("arxiv transform", () => {
	it("can parse xml", () => {
		const expected = {};
		const actual = fromXml(fixtures.arxivAtomPaper);

		expect(actual.length).toEqual(1);
		expect(actual.at(0).title).toEqual(fixtures.openAlexWork.display_name);
		expect(actual.at(0).title).toEqual(fixtures.openAlexWork.title);
		expect(actual.at(0).summary).toEqual(fixtures.openAlexWork.abstract);
	});

	it("can transform format", () => {
		const actual = toOpenAlexPapers(fixtures.arxivAtomPaper);

		expect(actual.length).toEqual(1);
		expect(actual.at(0)).toEqual(fixtures.openAlexWork);
	});
});
