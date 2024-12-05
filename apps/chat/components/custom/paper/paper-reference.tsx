import { OpenReference } from "../reference";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { ReferencePreview } from "../reference";
import { IndexedReferencedPaper } from "../reference-parser";

export default function PaperReference({
	paper,
	setOpenedReference,
	prefix,
}: {
	paper: IndexedReferencedPaper<ReferencePreview>;
	setOpenedReference: Dispatch<SetStateAction<OpenReference>>;
	prefix: string;
}) {
	const [isActive, setIsActive] = useState(false);
	const ref = useRef<HTMLAnchorElement>(null);
	const anchor = `#${prefix}-${paper.index}`;

	useEffect(() => {
		if (typeof window === "undefined") return;

		const handleHashChange = () => {
			if (ref.current && window.location.hash.includes(anchor)) {
				ref.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
			}
			setIsActive(window.location.hash === anchor);
		};
		handleHashChange();

		window.addEventListener("hashchange", handleHashChange, false);
		return () => {
			window.removeEventListener("hashchange", handleHashChange, false);
		};
	}, [anchor]);

	return (
		<div
			className="flex flex-col gap-2 p-3 border w-[100px] rounded-md shadow-sm bg-neutral-50 dark:bg-neutral-800 cursor-pointer"
			style={{
				backgroundColor: isActive ? "#0a161c" : "white",
				color: isActive ? "white" : "#0a161c",
			}}
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
			<div className="text-xs text-sidebar-foreground/50 text-center">
				{paper.index + 1}
			</div>
			<div className="line-clamp-5 text-sm">{paper.title}</div>
		</div>
	);
}
