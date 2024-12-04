import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";
import { Trackable } from "@/components/analytics/tracking/trackable";
import { uuid } from "@proemial/utils/uid";
import { useEffect, useState } from "react";
import { splitAndSanitize } from "@proemial/utils/references/santise-references";

export function useTextWithReferences(text?: string) {
	const [withReferences, setWithReferences] =
		useState<ReturnType<typeof processTextWithReferences>>();

	useEffect(() => {
		if (text) {
			const { markup, prefix, references } = processTextWithReferences(text);
			setWithReferences({ markup, prefix, references });
		}
	}, [text]);

	return (
		withReferences ?? {
			markup: undefined,
			prefix: "",
			references: [] as number[],
		}
	);
}

export type IndexedReferencedPaper<T> = T & { index: number };

export function indexPapers<T>(
	papers: T[],
	callback: (paper: IndexedReferencedPaper<T>) => boolean,
) {
	return papers.map((paper, index) => ({ ...paper, index })).filter(callback);
}

export function processTextWithReferences(text: string) {
	const references = new Set<number>();
	const prefix = uuid();

	const markup = splitAndSanitize(text).map((segment, i) => {
		const match = segment.match(/\[(.*?)\]/);
		if (match) {
			const numbers = match[1]?.split(",").map((n) => n.trim());
			numbers?.forEach((n) => references.add(Number.parseInt(n)));

			return numbers?.map((num, j) => (
				<Trackable
					key={`${i}-${j}`}
					trackingKey={analyticsKeys.chat.click.reference}
				>
					<span className="">
						<a
							href={`#${prefix}-${num}`}
							key={`${i}-${j}`}
							onClick={() =>
								document
									.getElementById("sources")
									?.scrollIntoView({ behavior: "smooth" })
							}
							className="items-center justify-center rounded-full bg-[#0A161C] text-white text-[10px] font-[1000] cursor-pointer hover:bg-gray-800 mb-4"
							style={{
								padding: "2px 5px",
								marginRight: "2px",
								position: "relative",
								top: "-2px",
							}}
						>
							{num}
						</a>
					</span>
				</Trackable>
			));
		}
		// Return regular text for non-link segments
		return segment;
	});

	return { markup, prefix, references: Array.from(references) };
}
