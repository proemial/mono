import { numberFrom } from "./string";

describe("numberFrom", () => {
	it("should convert letters to 0-8", () => {
		const fixture = ["c", "d", "e", "f", "g", "h", "i", "j", "k"];

		fixture.forEach((letter, index) => {
			// console.log(`numberFrom("${letter}")`, numberFrom(letter));
			expect(numberFrom(letter)).toBe(index);
		});
	});

	it("should convert letters to 0-3", () => {
		const fixture = [
			["c", "d", "e"],
			["f", "g", "h"],
			["i", "j", "k"],
		];

		for (const group of fixture) {
			group.forEach((letter, index) => {
				// console.log(`numberFrom("${letter}", 3)`, numberFrom(letter, 3));
				expect(numberFrom(letter, 3)).toBe(index);
			});
		}
	});
});
