import { fromXml, toOpenAlexPapers } from "./to-open-alex";
import { fixtures } from "./to-open-alex.fixture";

describe("arxiv transform", () => {
	it("can parse xml", () => {
		const expected = {};
		const actual = fromXml(fixtures.arxivAtomPaper);

		expect(actual.length).toEqual(1);

		const first = actual.at(0);
		expect(first?.title).toEqual(fixtures.openAlexWork.display_name);
		expect(first?.title).toEqual(fixtures.openAlexWork.title);
		expect(first?.summary).toEqual(fixtures.openAlexWork.abstract);
	});

	it("can transform format", () => {
		const actual = toOpenAlexPapers(fixtures.arxivAtomPaper);

		expect(actual.length).toEqual(1);
		expect(actual.at(0)).toEqual(fixtures.openAlexWork);
	});
});
