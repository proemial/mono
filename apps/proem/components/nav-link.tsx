// NavLink.js
"use client";

import { type VariantProps, cva } from "class-variance-authority";
import Link from "next/link";

interface NavLinkProps extends VariantProps<typeof linkVariants> {
	href: string;
	children: React.ReactNode;
	isActive?: boolean;
}

const linkVariants = cva(
	"text-foreground", // base styles
	{
		variants: {
			variant: {
				default: "font-normal",
				active: "font-bold border underline", // active variant styles
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

function NavLink({ href, children, isActive = false }: NavLinkProps) {
	const className = linkVariants({
		variant: isActive ? "active" : "default",
	});

	return (
		<Link href={href} className={className}>
			{children}
		</Link>
	);
}

export default NavLink;
