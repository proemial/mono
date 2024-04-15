"use client";

import { Profile } from "@/components/profile";
import {
	Button,
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
	cn,
} from "@proemial/shadcn-ui";
import { Compass, SquarePen } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
	{
		name: "Discover",
		href: "/discover",
	},
	{
		name: "Ask",
		href: "/",
	},
];

export function NavigationMenuBar() {
	const pathname = usePathname();

	const handleClick = () => {
		console.log(pathname);
	};

	return (
		<NavigationMenu className="sticky top-0 px-0 py-2.5 bg-background">
			<NavigationMenuList className="justify-between">
				<NavigationMenuItem>
					<Profile />
				</NavigationMenuItem>

				<NavigationMenuItem className="flex">
					{navigationItems.map((navigationItem, index) => (
						<Link
							href={navigationItem.href}
							className={cn(
								"flex h-7 items-center justify-center rounded-full px-4 text-center text-sm",
								pathname?.startsWith(navigationItem.href) ||
									(index === 0 && pathname === "/")
									? "bg-muted font-medium text-foreground"
									: "text-foreground",
							)}
						>
							{navigationItem.name}
						</Link>
					))}
				</NavigationMenuItem>

				<NavigationMenuItem className="flex-none px-1">
					{pathname === "/" && (
						<Button onClick={handleClick} variant="ghost">
							<SquarePen className="size-4" />
						</Button>
					)}
					{pathname !== "/" && (
						<Button onClick={handleClick} variant="ghost">
							<Compass className="size-4" />
						</Button>
					)}
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
}
