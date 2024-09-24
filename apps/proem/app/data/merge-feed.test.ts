import { describe, expect, it } from "vitest";
import { iterateStaticFeed } from "./iterate-static-feed";
import { PaginationOptions, mergeFeed, shuffleFeed } from "./merge-feed";

describe("mergeFeed", () => {
	it("should merge feeds correctly", async () => {
		const feedA = [
			{ id: "a1" },
			{ id: "a2" },
			{ id: "a3" },
			{ id: "a4" },
			{ id: "a5" },
			{ id: "a6" },
			{ id: "a7" },
			{ id: "a8" },
			{ id: "a9" },
		];

		const feedB = [{ id: "b1" }, { id: "b2" }, { id: "b3" }];

		const feedC = [
			{ id: "c1" },
			{ id: "c2" },
			{ id: "c3" },
			{ id: "c4" },
			{ id: "c5" },
			{ id: "c6" },
		];

		const fetchFeed = (options: PaginationOptions) =>
			mergeFeed(
				[
					{
						feed: (options) =>
							Promise.resolve(iterateStaticFeed(feedA)(options)),
						percentage: 0.2 as const,
					},
					{
						feed: (options) =>
							Promise.resolve(iterateStaticFeed(feedB)(options)),
						percentage: 0.2 as const,
					},
					{
						feed: (options) =>
							Promise.resolve(iterateStaticFeed(feedC)(options)),
						percentage: 0.6 as const,
					},
				],
				options,
			);
		const results1 = await fetchFeed({ offset: 0, limit: 5 });

		expect(results1?.count).toBe(18);
		expect(results1?.nextOffset).toBe(1);
		expect(results1?.rows).toHaveLength(5);
		expect(results1?.rows).toEqual([
			{ id: "a1" },
			{ id: "b1" },
			{ id: "c1" },
			{ id: "c2" },
			{ id: "c3" },
		]);

		const results2 = await fetchFeed({
			offset: results1?.nextOffset,
			limit: 5,
		});

		expect(results2?.count).toBe(18);
		expect(results2?.nextOffset).toBe(2);
		expect(results2?.rows).toHaveLength(5);
		expect(results2?.rows).toEqual([
			{ id: "a2" },
			{ id: "b2" },
			{ id: "c4" },
			{ id: "c5" },
			{ id: "c6" },
		]);

		const results3 = await fetchFeed({
			offset: results2?.nextOffset,
			limit: 5,
		});

		expect(results3?.count).toBe(18);
		expect(results3?.nextOffset).toBe(3);
		// TODO Handle pagination of multiple feeds
		expect(results3?.rows).toHaveLength(2);
	});

	it("can handle empty feeds", async () => {
		const feed1 = {
			count: 5,
			rows: [],
			nextOffset: 1,
		};

		const feed2 = {
			count: 5,
			rows: [],
			nextOffset: 1,
		};

		const feed3 = {
			count: 10,
			rows: [],
			nextOffset: 1,
		};

		const feeds = [
			{ feed: () => Promise.resolve(feed1), percentage: 0.2 as const },
			{ feed: () => Promise.resolve(feed2), percentage: 0.2 as const },
			{ feed: () => Promise.resolve(feed3), percentage: 0.6 as const },
		];

		const feed = await mergeFeed(feeds, { offset: 0, limit: 4 });
		expect(feed).toBeNull();
	});
});
