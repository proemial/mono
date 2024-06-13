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
			className={cn("text-sm px-5 py-1.5 duration-200", {
				"font-semibold bg-primary rounded-full": isActive,
			})}
		>
			<div>{title}</div>
		</Link>
	);
};
