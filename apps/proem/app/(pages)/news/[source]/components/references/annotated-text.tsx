import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";
import { Trackable } from "@/components/trackable";
import { useEffect, useState } from "react";

export function AnnotatedText({ children }: { children?: string }) {
	const { markup } = useTextWithReferences(children);

	return <>{markup}</>;
}

export function useTextWithReferences(text?: string) {
	const [withReferences, setWithReferences] =
		useState<ReturnType<typeof processTextWithReferences>>();

	useEffect(() => {
		if (text) {
			const { markup, references } = processTextWithReferences(text);
			console.log("references", references);
			setWithReferences({ markup, references });
		}
	}, [text]);

	return withReferences ?? { markup: undefined, references: [] as number[] };
}

function processTextWithReferences(children: string) {
	const references = new Set<number>();

	const markup = children
		.replace(/^\s*-\s*/gm, "")
		.split(/(\[.*?\])/)
		.map((segment, i) => {
			const match = segment.match(/\[(.*?)\]/);
			if (match) {
				const numbers = match[1]?.split(",").map((n) => n.trim());
				numbers?.forEach((n) => references.add(Number.parseInt(n)));

				return numbers?.map((num, j) => (
					<Trackable
						key={`${i}-${j}`}
						trackingKey={
							analyticsKeys.experiments.news.item.clickInlineReference
						}
					>
						<span className="">
							<a
								href={`#${num}`}
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

	return { markup, references: Array.from(references) };
}
