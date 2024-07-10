import { prettySlug } from "./pretty-slug";

describe("prettyslug", () => {
	it("should convert a string to a pretty slug", () => {
		const input = "Hello, World!";

		const slug = prettySlug(input);

		expect(slug.startsWith("hello-world!-")).toBe(true);
	});

	it("should handle special characters and spaces", () => {
		const input = "This, is. a , test!@#$%^&*()";

		const slug = prettySlug(input);

		expect(slug.startsWith("this-is-a")).toBe(true);
	});
});
