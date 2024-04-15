"use client";

import { Profile } from "@/components/profile";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	cn,
} from "@proemial/shadcn-ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { ButtonCompass } from "./button-compass";
import { ButtonEdit } from "./button-edit";

const navigationItems = [
	{
		name: "Discover",
		href: "/discover",
	},
	{
		name: "Ask",
		href: "/ask",
	},
];

export function NavigationMenuBar() {
	const pathname = usePathname();

	const handleClick = () => {
		console.log(pathname);
	};

	return (
		<NavigationMenu>
			<NavigationMenuList>
				<NavigationMenuItem className="flex-none" key="menu">
					<Profile />
				</NavigationMenuItem>
				<div className="flex-grow" />
				{navigationItems.map((navigationItem, index) => (
					<NavigationMenuItem key={navigationItem.href}>
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
					</NavigationMenuItem>
				))}
				<div className="flex-grow" />
				<NavigationMenuItem className="flex-none px-1" key="create">
					{pathname === "/ask" && (
						<Link href="#" legacyBehavior passHref>
							<ButtonEdit handleClick={handleClick} />
						</Link>
					)}
					{pathname !== "/ask" && (
						<Link href="#" legacyBehavior passHref>
							<ButtonCompass handleClick={handleClick} />
						</Link>
					)}
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
}

const ListItem = React.forwardRef<
	React.ElementRef<"a">,
	React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
	return (
		<li>
			<NavigationMenuLink asChild>
				<a
					ref={ref}
					className={cn(
						"block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
						className,
					)}
					{...props}
				>
					<div className="text-sm font-medium leading-none">{title}</div>
					<p className="text-sm leading-snug line-clamp-2 text-muted-foreground">
						{children}
					</p>
				</a>
			</NavigationMenuLink>
		</li>
	);
});
ListItem.displayName = "ListItem";
