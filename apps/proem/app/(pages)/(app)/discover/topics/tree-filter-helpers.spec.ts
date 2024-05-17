import { TreeFilterHelpers } from "./tree-filter-helpers";

describe("OaFilter", () => {
	it("toQueryString groups domains and fields (AND)", () => {
		const fixture = ["domain:1", "domain:2", "field:1", "field:2"];
		const expected = "and:domain:1+2,field:1+2";

		expect(TreeFilterHelpers.toQueryString(fixture, true)).toEqual(expected);
	});

	it("toQueryString groups domains and fields (OR)", () => {
		const fixture = ["domain:1", "domain:2", "field:1", "field:2"];
		const expected = "or:domain:1|2,field:1|2";

		expect(TreeFilterHelpers.toQueryString(fixture)).toEqual(expected);
	});

	it("toQueryString handles single field", () => {
		const fixture = ["domain:1"];
		const expected = "domain:1";

		expect(TreeFilterHelpers.toQueryString(fixture)).toEqual(expected);
	});

	it("toSelectedIdsArray extracts domains and fields", () => {
		const fixture = "and:domain:1 2,field:1 2";
		const expected = ["domain:1", "domain:2", "field:1", "field:2"];

		expect(TreeFilterHelpers.toSelectedIdsArray(fixture)).toEqual(expected);
	});

	it("toSelectedIdsArray extracts domains and fields", () => {
		const fixture = "and:domain:1+2,field:1+2";
		const expected = ["domain:1", "domain:2", "field:1", "field:2"];

		expect(TreeFilterHelpers.toSelectedIdsArray(fixture)).toEqual(expected);
	});

	it("toSelectedIdsArray extracts domains and fields", () => {
		const fixture = "or:domain:1|2,field:1|2";
		const expected = ["domain:1", "domain:2", "field:1", "field:2"];

		expect(TreeFilterHelpers.toSelectedIdsArray(fixture)).toEqual(expected);
	});

	it("toOaFilter expands fields", () => {
		const fixture = "or:domain:1|2,field:3|4,subfield:5+6,topic:7";
		const expected = "or:topics.domain.id:1|2,topics.field.id:3|4,topics.subfield.id:5+6,topics.id:7";

		expect(TreeFilterHelpers.toOaFilter(fixture)).toEqual(expected);
	});

	it("toOaFilter expands fields", () => {
		const fixture = "and:subfield:5+6";
		const expected = "and:topics.subfield.id:5+6";

		expect(TreeFilterHelpers.toOaFilter(fixture)).toEqual(expected);
	});

	it("toOaFilter splits OR queries", () => {
		const fixture = "or:subfield:5+6,topic:7";
		const expected = {filters:["topics.subfield.id:5+6", "topics.id:7"], narrow: false};

		expect(TreeFilterHelpers.toOaFilters(fixture)).toEqual(expected);
	});

	it("toOaFilter does not split AND queries", () => {
		const fixture = "and:subfield:5+6,topic:7";
		const expected = {filters:["topics.subfield.id:5+6,topics.id:7"], narrow: true};

		expect(TreeFilterHelpers.toOaFilters(fixture)).toEqual(expected);
	});
});
