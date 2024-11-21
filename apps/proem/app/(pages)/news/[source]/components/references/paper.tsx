import { ReferencedPaper } from "@proemial/adapters/redis/news";
import dayjs from "dayjs";
import { useEffect, useState, useRef } from "react";

export function Paper({
	paper,
	index,
	prefix,
}: { paper?: ReferencedPaper; index: number; prefix?: string }) {
	const [isActive, setIsActive] = useState(false);
	const ref = useRef<HTMLAnchorElement>(null);
	const anchor = `${prefix}-${index + 1}`;

	useEffect(() => {
		if (typeof window === "undefined") return;

		const handleHashChange = () => {
			if (ref.current && window.location.hash.includes(anchor)) {
				ref.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
			}
			setIsActive(window.location.hash.includes(anchor));
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
				className={`flex flex-col p-2 ${isActive ? "bg-[#7DFA86]" : "bg-[#cfd5d8]"} shadow-sm rounded-md w-[30%] md:w-[20%] flex-shrink-0`}
				ref={ref}
			>
				<div className="flex flex-row justify-between mt-1 mb-4 w-full">
					<span
						className="items-center justify-center rounded-full bg-[#0A161C] text-white text-[10px] font-[1000] cursor-pointer hover:bg-gray-800"
						style={{
							padding: "1px 4px",
						}}
					>
						&nbsp;{index + 1}&nbsp;
					</span>
					<div className="text-[10px] text-gray-500">
						{paper?.published && `${dayjs(paper.published).format("MMM YYYY")}`}
					</div>
				</div>

				<div className="text-[11px] line-clamp-2">{paper?.title}</div>
				<div className="text-[10px] italic text-gray-500 mt-1 mb-1">
					<div className="line-clamp-2">
						{paper?.primary_location?.source?.host_organization_name}
					</div>
				</div>
			</a>
		</>
	);
}
