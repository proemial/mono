import { getFeatureFlags } from "@/app/components/feature-flags/server-flags";
import { Features, keyByValue } from "./features";

describe("keyByValue", () => {
	it("should return the correct key for a given value", () => {
		const value = Features.showMainTopicInCards;
		const expectedKey = "showMainTopicInCards";

		const result = keyByValue(value);

		expect(result).toBe(expectedKey);
	});

	it("should return undefined for an invalid value", () => {
		const value = "invalidValue";

		const result = keyByValue(value);

		expect(result).toBeUndefined();
	});
});
