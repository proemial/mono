import { TreeFilterHelpers } from "./tree-filter-helpers";

describe("OaFilter", () => {
	it("toQueryString groups domains and fields", () => {
		const fixture = ["domain:1", "domain:2", "field:1", "field:2"];
		const expected = "topics.domain.id:1+2,topics.field.id:1+2";

		expect(TreeFilterHelpers.toQueryString(fixture)).toEqual(expected);
	});

	it("toSelectedIdsArray extracts domains and fields", () => {
		const fixture = "topics.domain.id:1 2,topics.field.id:1 2";
		const expected = ["domain:1", "domain:2", "field:1", "field:2"];

		expect(TreeFilterHelpers.toSelectedIdsArray(fixture)).toEqual(expected);
	});
});
