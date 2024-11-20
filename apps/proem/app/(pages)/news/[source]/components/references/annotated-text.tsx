import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";
import { Trackable } from "@/components/trackable";
import { useEffect, useState } from "react";

export function AnnotatedText({ children }: { children?: string }) {
	const [text, setText] = useState<React.ReactNode[]>();

	useEffect(() => {
		if (children) {
			setText(
				children
					.replace(/^\s*-\s*/gm, "")
					.split(/(\[.*?\])/)
					.map((segment, i) => {
						const match = segment.match(/\[(.*?)\]/);
						if (match) {
							const numbers = match[1]?.split(",").map((n) => n.trim());
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
					}),
			);
		}
	}, [children]);

	return <div>{text}</div>;
}
