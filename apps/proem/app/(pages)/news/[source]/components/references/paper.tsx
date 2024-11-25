import { ReferencedPaper } from "@proemial/adapters/redis/news";
import dayjs from "dayjs";
import { useEffect, useState, useRef } from "react";

export function Paper({
	paper,
	index,
	prefix,
	activeColors,
}: {
	paper?: ReferencedPaper;
	index: number;
	prefix?: string;
	activeColors?: { foreground?: string; background?: string };
}) {
	const [isActive, setIsActive] = useState(false);
	const ref = useRef<HTMLAnchorElement>(null);
	const anchor = `#${prefix}-${index + 1}`;

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
		<>
			<a
				href={`/news/paper/oa/${paper?.id?.split("/").at(-1)}`}
				className={
					"flex flex-col p-2 rounded-md animate-fade-in w-[100px] flex-shrink-0 cursor-pointer hover:shadow-sm active:shadow-none hover:-translate-y-[1px] active:-translate-y-[0] transition-transform"
				}
				style={{
					backgroundColor: isActive ? "#0a161c" : "white",
					color: isActive ? "white" : "#0a161c",
				}}
				ref={ref}
			>
				<div className="flex flex-row justify-between mt-1 mb-4 w-full">
					<span
						className="items-center justify-center rounded-full text-[10px] font-[1000]"
						style={{
							padding: "1px 4px",
							color: isActive ? "#0a161c" : "white",
							backgroundColor: isActive ? "white" : "#0a161c",
						}}
					>
						&nbsp;{index + 1}&nbsp;
					</span>
					<div className="text-[10px] text-[#6d7e86]">
						{paper?.published && `${dayjs(paper.published).format("MMM YYYY")}`}
					</div>
				</div>

				<div className="text-[11px] line-clamp-3 capitalize">{paper?.title?.toLowerCase()}</div>
				<div className="text-[10px] italic mt-1 mb-1 text-[#6d7e86]">
					<div className="line-clamp-2 capitalize">
						{(
							paper?.primary_location?.source?.host_organization_name ?? 
							paper?.primary_location?.source?.display_name ??
							paper?.authorships?.at(0)?.author?.institution ??
							paper?.authorships?.at(0)?.author?.display_name
						)?.toLowerCase()}
					</div>
				</div>
			</a>
		</>
	);
}
