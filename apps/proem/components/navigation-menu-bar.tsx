"use client";

import { useExperimental } from "@/app/hooks/use-user";
import { Profile } from "@/app/profile/profile";
import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import { routes } from "@/routes";
import {
	Button,
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	cn,
} from "@proemial/shadcn-ui";
import { Edit05, SearchMd, X } from "@untitled-ui/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function NavigationMenuBar({ title }: { title?: string }) {
	const pathname = usePathname();
	const [askHref, setAskHref] = useState<string>(routes.ask);
	const isAskPage = pathname === routes.ask;

	useEffect(() => {
		if (isAskPage || pathname.includes(routes.answer)) {
			setAskHref(pathname);
		}
	}, [pathname, isAskPage]);

	const showSearch = pathname === routes.space;
	console.log("showSearch", pathname, showSearch);

	return (
		<NavigationMenu className="sticky top-0 pr-0 bg-background">
			<NavigationMenuList className="justify-between">
				<NavigationMenuItem>
					<Profile />
				</NavigationMenuItem>

				<div className="flex gap-4">
					{title && title}
					{!title && (
						<>
							<NavItem
								label="Discover"
								href={routes.space}
								isActive={() => pathname.includes(routes.space)}
								onClick={() =>
									trackHandler(analyticsKeys.ui.header.click.discover)
								}
							/>
							<NavItem
								label="Ask"
								href={askHref}
								isActive={() => pathname.includes(routes.ask)}
								onClick={() => trackHandler(analyticsKeys.ui.header.click.ask)}
							/>
						</>
					)}
				</div>

				<NavigationMenuItem
					className={cn("flex-none px-1 invisible", {
						visible: title || showSearch || pathname === askHref,
					})}
				>
					{showSearch && <ShowSearch />}
					{title && <CloseSearch />}
					{!title && !showSearch && <ClearChat isFrontpage={isAskPage} />}
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
}

function ClearChat({ isFrontpage }: { isFrontpage: boolean }) {
	return (
		<Link
			href={routes.ask}
			onClick={
				!isFrontpage
					? trackHandler(`ask:${analyticsKeys.chat.click.clear}`)
					: undefined
			}
		>
			<Button variant="ghost" disabled={isFrontpage}>
				<Edit05 className="size-5" />
			</Button>
		</Link>
	);
}

function ShowSearch() {
	const experimental = useExperimental();
	if (!experimental) return null;

	return (
		<Link href={routes.search}>
			<Button variant="ghost">
				<SearchMd className="size-5" />
			</Button>
		</Link>
	);
}

function CloseSearch() {
	return (
		<Link href={routes.space}>
			<Button variant="ghost">
				<X className="size-5" />
			</Button>
		</Link>
	);
}

const NavItem = ({
	label,
	href,
	isActive,
	onClick,
}: {
	label: string;
	href: string;
	isActive: () => boolean;
	onClick?: () => void;
}) => {
	return (
		<NavigationMenuItem onClick={onClick}>
			<Link href={href} legacyBehavior passHref>
				<NavigationMenuLink
					className={cn("px-4 py-1.5 select-none", {
						"bg-primary rounded-full text-primary-foreground font-semibold text-[15px]":
							isActive(),
					})}
				>
					{label}
				</NavigationMenuLink>
			</Link>
		</NavigationMenuItem>
	);
};
