"use client";

import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

type Props = {
	items: string[];
	rootPath: string;
};

function useActiveTab(defaultTab: string) {
	const pathname = usePathname();

	const conceptFromPath = pathname?.split("/")[2];
	const conceptFromCookie = getCookie("latestFeedConcept") as string;
	const activeTab = conceptFromPath ?? conceptFromCookie ?? defaultTab;

	const active = decodeURI(activeTab);
	const fromPath = conceptFromPath ? decodeURI(conceptFromPath) : undefined;

	if (conceptFromPath) {
		if (conceptFromPath !== "all") {
			setCookie("latestFeedConcept", conceptFromPath);
		} else {
			deleteCookie("latestFeedConcept");
		}
	}

	return { active, fromPath };
}

export function TabNavigation({ items, rootPath }: Props) {
	const router = useRouter();
	const { active, fromPath } = useActiveTab(items[0] as string);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (fromPath !== active) {
			router.replace(`${rootPath}/${active}`);
		}
	}, [active, fromPath]);

	useEffect(() => {
		if (active && ref?.current) {
			ref.current.scrollIntoView(false);
		}
	}, []);

	const handleChildClick = (item: string) => {
		router.replace(`${rootPath}/${item}`);
	};

	const tabStyle = (item: string) =>
		`px-2 py-1 rounded-[2px] whitespace-nowrap cursor-pointer ${
			isActive(item) ? "bg-[#7DFA86] text-black" : "text-white/50"
		}`;

	const isActive = (item: string) => active === item;

	return (
		<>
			<div className="max-w-screen-sm px-4 flex gap-1 text-[14px] overflow-x-scroll no-scrollbar scroll-px-5 select-none">
				{items.map((item) => (
					<div
						key={item}
						className={tabStyle(item)}
						onClick={() => handleChildClick(item)}
						ref={isActive(item) ? ref : undefined}
					>
						{item}
					</div>
				))}
			</div>
		</>
	);
}
