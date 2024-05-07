"use client";

import { cn } from "@proemial/shadcn-ui";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

const TOPIC_SEARCH_PARAM = "topic";

type Props = {
	items: string[];
	rootPath: string;
};

function useActiveTab(defaultTab: string) {
	const searchParams = useSearchParams();
	const conceptFromPath = searchParams.get(TOPIC_SEARCH_PARAM);

	const conceptFromCookie = getCookie("latestFeedConcept") as string;
	const activeTab = conceptFromPath ?? conceptFromCookie ?? defaultTab;

	if (conceptFromPath) {
		if (conceptFromPath !== "all") {
			setCookie("latestFeedConcept", conceptFromPath);
		} else {
			deleteCookie("latestFeedConcept");
		}
	}

	return { active: activeTab, fromPath: conceptFromPath };
}

export function TabNavigation({ items, rootPath }: Props) {
	const router = useRouter();
	const { active, fromPath } = useActiveTab(items[0] as string);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (fromPath !== active) {
			router.replace(`${rootPath}/?${TOPIC_SEARCH_PARAM}=${active}`);
		}
	}, [active, fromPath]);

	useEffect(() => {
		if (active && ref?.current) {
			ref.current.scrollIntoView(false);
		}
	}, []);

	return (
		<>
			<div className="flex gap-1.5">
				{items.map((item) => (
					<Link
						href={`${rootPath}/?${TOPIC_SEARCH_PARAM}=${item}`}
						key={item}
						prefetch={false}
						scroll={false}
					>
						<div
							key={item}
							className={cn(
								"px-3.5 py-1.5 whitespace-nowrap cursor-pointer bg-primary rounded-full text-[9px] select-none uppercase font-semibold",
								{
									"text-secondary-foreground bg-secondary font-extrabold":
										item === active,
								},
							)}
							ref={item === active ? ref : undefined}
						>
							{item}
						</div>
					</Link>
				))}
			</div>
		</>
	);
}
