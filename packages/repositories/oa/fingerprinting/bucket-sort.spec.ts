import { shuffle } from "@proemial/utils/array";
import { bucketSort, getBuckets } from "./bucket-sort";
import { RankedPaper } from "./rerank";

const mock = (id: string) => ({
	paper: { data: { primaryTopic: { field: { id: id } } } },
});

const fixture = [
	mock("T1"),
	mock("T1"),
	mock("T1"),
	mock("T1"),
	mock("T1"),
	mock("T2"),
	mock("T2"),
	mock("T2"),
	mock("T2"),
	mock("T2"),
	mock("T3"),
	mock("T3"),
	mock("T3"),
	mock("T3"),
	mock("T3"),
	mock("T4"),
	mock("T4"),
	mock("T4"),
	mock("T4"),
	mock("T4"),
] as RankedPaper[];

describe("bucketSort()", () => {
	it("can bucket sort papers", () => {
		console.log("fixture", fixture?.length);
		const result = bucketSort(fixture);
		console.log("result", result);

		expect(result).toHaveLength(20);

		// expect(result[0].filterMatchScore).toBe(6);
		// expect(result[1].filterMatchScore).toBe(5);
		// expect(result[2].filterMatchScore).toBe(4);
		// expect(result[3].filterMatchScore).toBe(3);
		// expect(result[4].filterMatchScore).toBe(2);
		// expect(result[5].filterMatchScore).toBe(1);
	});
});

describe("getBuckets()", () => {
	it("can bucket papers", () => {
		const result = getBuckets(fixture, 3);

		expect(result).toHaveLength(4);
		expect(result[0]).toEqual(fixture.slice(0, 5));
		expect(result[3]).toEqual(fixture.slice(15, 20));
	});
});

describe("shuffle()", () => {
	it("can shuffle arrays", () => {
		expect(shuffle([1, 2, 3, 4, 5])).toHaveLength(5);

		const fixture = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }] as {
			id: number;
		}[];
		const result: { id: number }[] = shuffle(fixture);
		expect(result).toHaveLength(5);
	});
});
