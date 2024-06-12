"use client";

import { cn } from "@proemial/shadcn-ui";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const NavButton = ({ href, title }: { href: string; title: string }) => {
	const pathname = usePathname();
	const isActive = pathname === href;
	return (
		<Link
			href={href}
			className={cn("text-sm", {
				"opacity-75": !isActive,
				"font-semibold": isActive,
			})}
		>
			<div>{title}</div>
		</Link>
	);
};
