import { RankedPaper } from "./rerank";
import { shuffle } from "@proemial/utils/array";

export function bucketSort(papers: RankedPaper[]): RankedPaper[] {
	const copy = [...papers];
	const result = [] as RankedPaper[];

	const buckets = getBuckets(copy);
	for (let i = 0; i < buckets.length; i++) {
		const batch = buckets.slice(i, i + 3);
		const count =
			(batch[0]?.length ?? 0) +
			(batch[1]?.length ?? 0) +
			(batch[2]?.length ?? 0);

		for (let j = 0; j < count; j++) {
			const fromB1 = batch[0]?.splice(0, some());
			const fromB2 = batch[1]?.splice(0, some());
			const fromB3 = batch[2]?.splice(0, some());

			const all = shuffle([
				...(fromB1 || []),
				...(fromB2 || []),
				...(fromB3 || []),
			]);

			result.push(...all);

			j += all.length - 1;
		}
		i += batch.length - 1;
	}

	return result;
}

function some() {
	return Math.floor(Math.random() * 3);
}

export function getBuckets(papers: RankedPaper[]) {
	const buckets = [] as Array<RankedPaper[]>;
	const bucketIndex = {} as { [id: string]: number };

	for (const paper of papers) {
		const fieldId = paper.paper.data.topics?.at(0)?.field.id;
		if (!fieldId) continue;

		if (!Object.keys(bucketIndex).includes(fieldId)) {
			bucketIndex[fieldId] = buckets.length;
			buckets.push([]);
		}
		const index = bucketIndex[fieldId];
		buckets[index as number]?.push(paper);
	}

	return buckets;
}
