import { describe, it, expect } from "vitest";
import { Paper } from ".";

describe("Paper.byPopularity", () => {
	it("should fetch 5 popular papers", async () => {
		const data = await Paper.getByPopularity({ limit: 5, offset: 0 });

		expect(data.length).toBe(5);
		data.forEach((item) => {
			expect(item.paperReadsCount + item.postsCount).toBeGreaterThan(0);
		});
	});
});
