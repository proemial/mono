import { describe, expect, it } from "vitest";
import { mergeFeed, shuffleFeed } from "./merge-feed";

describe("mergeFeed", () => {
	it("should merge feeds correctly", async () => {
		const feed1 = {
			count: 5,
			rows: [
				{ id: "W2", title: "Paper 2" },
				{ id: "W1", title: "Paper 1" },
			],
			nextOffset: 1,
		};

		const feed2 = {
			count: 5,
			rows: [
				{ id: "W3", title: "Paper 3" },
				{ id: "W4", title: "Paper 4" },
			],
			nextOffset: 1,
		};

		const feed3 = {
			count: 10,
			rows: [
				{ id: "W7", title: "Paper 7" },
				{ id: "W5", title: "Paper 5" },
				{ id: "W9", title: "Paper 9" },
				{ id: "W10", title: "Paper 10" },
				{ id: "W8", title: "Paper 8" },
				{ id: "W6", title: "Paper 6" },
			],
			nextOffset: 1,
		};

		const feeds = [
			{ feed: () => Promise.resolve(feed1), percentage: 0.2 as const },
			{ feed: () => Promise.resolve(feed2), percentage: 0.2 as const },
			{ feed: () => Promise.resolve(feed3), percentage: 0.6 as const },
		];

		const feed = await mergeFeed(feeds, { offset: 0, limit: 4 });
		expect(feed?.count).toBe(20);
		expect(feed?.nextOffset).toBe(1);
		expect(feed?.rows).toHaveLength(10);
		expect(feed?.rows).toEqual([
			{ id: "W1", title: "Paper 1" },
			{ id: "W10", title: "Paper 10" },
			{ id: "W2", title: "Paper 2" },
			{ id: "W3", title: "Paper 3" },
			{ id: "W4", title: "Paper 4" },
			{ id: "W5", title: "Paper 5" },
			{ id: "W6", title: "Paper 6" },
			{ id: "W7", title: "Paper 7" },
			{ id: "W8", title: "Paper 8" },
			{ id: "W9", title: "Paper 9" },
		]);
	});
});
