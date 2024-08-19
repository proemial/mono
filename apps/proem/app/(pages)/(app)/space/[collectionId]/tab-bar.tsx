"use client";

import { usePathname, useRouter } from "next/navigation";
import { useOptimistic, useTransition } from "react";

import { Tabs, TabsList, TabsTrigger } from "@proemial/shadcn-ui";

type TabBarProps = {
	tabs: {
		href: string;
		title: string;
	}[];
};
export const TabBar = ({ tabs }: TabBarProps) => {
	const [isPending, startTransition] = useTransition();
	const pathname = usePathname();
	const [optimisticPathname, setOptimisticPathname] =
		useOptimistic<string>(pathname);
	const router = useRouter();

	return (
		<div data-section-transition={isPending ? "" : undefined}>
			<Tabs
				className="flex justify-center"
				value={optimisticPathname}
				onValueChange={(value) => {
					startTransition(() => {
						setOptimisticPathname(value);
						router.push(value);
					});
				}}
			>
				<TabsList className="bg-transparent space-x-2">
					{tabs.map((tab) => (
						<TabsTrigger
							key={tab.title}
							value={tab.href}
							className="text-base px-5 py-1.5 bg-theme-200/30 rounded-full [&[data-state=active]]:bg-theme-900 [&[data-state=active]]:text-white text-foreground transition-all"
						>
							{tab.title}
						</TabsTrigger>
					))}
				</TabsList>
			</Tabs>
		</div>
	);
};
