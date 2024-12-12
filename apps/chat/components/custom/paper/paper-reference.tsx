import { OpenReference } from "../reference";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { ReferencePreview } from "../reference";
import { IndexedReferencedPaper } from "../reference-parser";
import { Markdown } from "../markdown";

export default function PaperReference({
	paper,
	openedReference,
	setOpenedReference,
	prefix,
}: {
	paper: IndexedReferencedPaper<ReferencePreview>;
	openedReference: OpenReference;
	setOpenedReference: Dispatch<SetStateAction<OpenReference>>;
	prefix: string;
}) {
	const [isActive, setIsActive] = useState(false);
	const ref = useRef<HTMLAnchorElement>(null);
	const anchor = `#${prefix}-${paper.index}`;

	const open =
		openedReference.isVisible &&
		openedReference?.preview?.link === paper.link &&
		openedReference?.preview?.index === paper.index;

	useEffect(() => {
		if (typeof window === "undefined") return;

		const handleHashChange = () => {
			if (ref.current && window.location.hash.includes(anchor)) {
				ref.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
			}
			setIsActive(open || window.location.hash === anchor);
		};
		handleHashChange();

		window.addEventListener("hashchange", handleHashChange, false);
		return () => {
			window.removeEventListener("hashchange", handleHashChange, false);
		};
	}, [anchor, open]);

	return (
		<div
			className={`flex flex-col gap-2 p-2.5 border min-w-[93px] w-[93px] rounded-md shadow-sm bg-card cursor-pointer active:border-foreground active:bg-foreground/5 ${isActive ? "border-foreground bg-foreground/5" : ""}`}
			onClick={(event) => {
				const rect = event.currentTarget.getBoundingClientRect();

				setOpenedReference({
					preview: paper,
					isVisible: true,
					boundingBox: {
						top: rect.top,
						left: rect.left,
						width: rect.width,
						height: rect.height,
					},
				});
			}}
		>
			<div className="flex justify-between">
				<div className="text-xl relative text-foreground/80 -top-1">
					{paper.index + 1}
				</div>
				<div className="text-[10px] text-foreground/80 whitespace-nowrap">
					{new Date(paper.publicationDate).toLocaleDateString("en-US", {
						month: "short",
						year: "numeric",
					})}
				</div>
			</div>
			<div className="line-clamp-3 text-[11px] font-semibold text-foreground/80">
				<Markdown>{paper.title}</Markdown>
			</div>
		</div>
	);
}
