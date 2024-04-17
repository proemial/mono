"use client";

import { Profile } from "@/components/profile";
import {
	Button,
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
	cn,
} from "@proemial/shadcn-ui";
import { Edit05 } from "@untitled-ui/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = {
	discover: {
		name: "Discover",
		href: "/discover",
	},
	ask: {
		name: "Ask",
	},
};

export function NavigationMenuBar() {
	const pathname = usePathname();
	const [askHref, setAskHref] = useState<string>("/");

	useEffect(() => {
		if (pathname === "/" || pathname.includes("/answer")) {
			setAskHref(pathname);
		}
	}, [pathname]);

	return (
		<NavigationMenu className="sticky top-0 px-0 py-2.5 bg-background">
			<NavigationMenuList className="justify-between">
				<NavigationMenuItem>
					<Profile />
				</NavigationMenuItem>

				<NavigationMenuItem className="flex">
					{/* Discover link is disabled until feature is implemented */}
					<Link
						href={navItems.discover.href}
						aria-disabled
						tabIndex={-1}
						className={cn(
							"flex h-7 items-center justify-center rounded-full px-4 text-center text-sm pointer-events-none text-muted-foreground",
							pathname === navItems.discover.href ? "bg-muted font-medium" : "",
						)}
					>
						{navItems.discover.name}
					</Link>
					<Link
						href={askHref}
						className={cn(
							"flex h-7 items-center justify-center rounded-full px-4 text-center text-sm",
							pathname === askHref
								? "bg-muted font-medium text-foreground"
								: "text-foreground",
						)}
					>
						{navItems.ask.name}
					</Link>
				</NavigationMenuItem>

				<NavigationMenuItem className="flex-none px-1">
					<Link href="/">
						<Button variant="ghost">
							<Edit05 className="size-4" />
						</Button>
					</Link>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
}
