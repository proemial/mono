"use client";

import { useRunOnFirstRender } from "@/app/hooks/use-run-on-first-render";
import { cn } from "@proemial/shadcn-ui";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";

const TOPIC_SEARCH_PARAM = "field";

type Props = {
	items: string[];
	rootPath: string;
};

function useActiveTab({
	defaultTab,
	rootPath,
}: { defaultTab?: string; rootPath: string }) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const fromPath = searchParams.get(TOPIC_SEARCH_PARAM);
	const conceptFromCookie = getCookie("latestFeedConcept");
	const active = fromPath ?? conceptFromCookie ?? defaultTab;

	useRunOnFirstRender(() => {
		const conceptFromPath = searchParams.get(TOPIC_SEARCH_PARAM);
		console.log(conceptFromPath);
		if (fromPath !== active) {
			router.replace(`${rootPath}/?${TOPIC_SEARCH_PARAM}=${active}`);
		}
	});

	if (fromPath) {
		if (fromPath !== "all") {
			setCookie("latestFeedConcept", fromPath);
		} else {
			deleteCookie("latestFeedConcept");
		}
	}

	return { active: active, fromPath: fromPath };
}

export function FeedFilter({ items, rootPath }: Props) {
	const { active } = useActiveTab({ defaultTab: items[0], rootPath });
	const ref = useRef<HTMLDivElement>(null);

	useRunOnFirstRender(() => {
		// TODO! test
		if (active && ref?.current) {
			ref.current.scrollIntoView(false);
		}
	});

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
