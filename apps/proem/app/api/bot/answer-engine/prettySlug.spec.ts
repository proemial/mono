import { prettySlug } from "./prettySlug";

describe("prettyslug", () => {
  it("should convert a string to a pretty slug", () => {
    const input = "Hello, World!";
    const expectedOutput = "hello-world";

    const result = prettySlug(input);

    expect(result).toEqual(expectedOutput);
  });

  it("should handle special characters and spaces", () => {
    const input = "This, test!@#$%^&*()";
    const expectedOutput = "this-is-a-test";

    const result = prettySlug(input);

    expect(result).toEqual(expectedOutput);
  });

  // Add more test cases as needed
});
