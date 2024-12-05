import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";
import { Trackable } from "@/components/analytics/tracking/trackable";
import { uuid } from "@proemial/utils/uid";
import { useEffect, useState } from "react";
import { splitAndSanitize } from "@proemial/utils/references/santise-references";
import { ReferencePreview } from "./reference";

type TextWithReferences = ReturnType<typeof processTextWithReferences> & {
	indexedPapers?: IndexedReferencedPaper<ReferencePreview>[];
};

export function useTextWithReferences(
	text?: string,
	papers?: ReferencePreview[],
) {
	const [withReferences, setWithReferences] = useState<TextWithReferences>();

	useEffect(() => {
		if (text) {
			const { markup, prefix, references } = processTextWithReferences(
				text,
				papers,
			);

			const indexedPapers =
				papers &&
				indexPapers(
					papers,
					(paper) => references?.includes(paper?.index + 1) ?? false,
				);
			setWithReferences({ markup, prefix, references, indexedPapers });
		}
	}, [text, papers]);

	return (withReferences ?? {
		markup: undefined,
		prefix: "",
		references: [] as number[],
	}) as TextWithReferences;
}

export type IndexedReferencedPaper<T> = T & { index: number };

export function indexPapers<T>(
	papers: T[],
	callback: (paper: IndexedReferencedPaper<T>) => boolean,
) {
	return papers.map((paper, index) => ({ ...paper, index })).filter(callback);
}

export function processTextWithReferences(
	text: string,
	papers?: ReferencePreview[],
) {
	const references = new Set<number>();
	const prefix = uuid();
	// Create a mapping for renumbering
	const referenceMap = new Map<number, number>();
	let currentIndex = 1;

	const isValidReference = (index: string) => {
		const num = Number.parseInt(index);
		return num > 0 && num <= (papers?.length ?? 0);
	};

	// First pass to collect and map references
	splitAndSanitize(text).forEach((segment) => {
		const match = segment.match(/\[(.*?)\]/);
		if (match) {
			const nums = match[1]
				?.split(",")
				.map((n) => n.trim())
				.filter(isValidReference)
				.map((n) => Number.parseInt(n));

			nums?.forEach((num) => {
				if (!referenceMap.has(num)) {
					referenceMap.set(num, currentIndex++);
				}
				references.add(num);
			});
		}
	});

	const createReferenceLink = (originalNum: string, i: number, j: number) => {
		const index = referenceMap.get(Number.parseInt(originalNum)) ?? 0;
		return (
			<Trackable
				key={`${i}-${j}`}
				trackingKey={analyticsKeys.chat.click.reference}
			>
				<a
					href={`#${prefix}-${index - 1}`}
					onClick={() =>
						document
							.getElementById("sources")
							?.scrollIntoView({ behavior: "smooth" })
					}
					className="inline-flex items-center rounded-full bg-[#0A161C] hover:bg-gray-800 text-white text-[10px] font-[1000] px-[5px] py-[2px] -top-[2px] mr-[2px] relative cursor-pointer"
				>
					{index}
				</a>
			</Trackable>
		);
	};

	const markup = splitAndSanitize(text).map((segment, i) => {
		const match = segment.match(/\[(.*?)\]/);
		if (!match) return segment;

		const nums = match[1]
			?.split(",")
			.map((n) => n.trim())
			.filter(isValidReference);
		nums?.forEach((n) => references.add(Number.parseInt(n)));

		return nums?.map((num, j) => createReferenceLink(num, i, j));
	});

	return {
		markup,
		prefix,
		references: Array.from(references).map((ref) => referenceMap.get(ref)),
	};
}
