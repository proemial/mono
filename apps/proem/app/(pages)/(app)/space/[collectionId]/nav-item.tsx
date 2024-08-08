"use client";

import { cn } from "@proemial/shadcn-ui";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const NavItem = ({ href, title }: { href: string; title: string }) => {
	const pathname = usePathname();
	const isActive = pathname === href;
	return (
		<Link
			href={href}
			className={cn("text-base px-5 py-1.5 bg-theme-200/30 rounded-full", {
				"bg-theme-900 text-white": isActive,
			})}
		>
			<div>{title}</div>
		</Link>
	);
};
