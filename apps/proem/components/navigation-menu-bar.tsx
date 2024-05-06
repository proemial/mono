"use client";

import { useExperimental } from "@/app/hooks/use-user";
import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import { Profile } from "@/components/profile";
import {
	Button,
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "@proemial/shadcn-ui";
import { Edit05 } from "@untitled-ui/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function NavigationMenuBar() {
	const pathname = usePathname();
	const [askHref, setAskHref] = useState<string>("/");
	const isProemian = useExperimental();

	useEffect(() => {
		if (pathname === "/" || pathname.includes("/answer")) {
			setAskHref(pathname);
		}
	}, [pathname]);

	const isFrontpage = pathname === "/";

	return (
		<NavigationMenu className="sticky top-0 px-0 py-2.5 bg-background">
			<NavigationMenuList className="justify-between">
				<NavigationMenuItem>
					<Profile />
				</NavigationMenuItem>

				{isProemian && (
					<div className="flex gap-4">
						<NavItem
							label="Discover"
							href="/discover"
							isActive={() => pathname.includes("/discover")}
						/>
						<NavItem
							label="Ask"
							href={askHref}
							isActive={() => pathname === askHref}
						/>
					</div>
				)}

				<NavigationMenuItem
					className={`flex-none px-1 ${
						pathname === askHref
							? "visible"
							: isProemian
								? "invisible"
								: "visible"
					}`}
				>
					<Link
						href="/"
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
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
}

const NavItem = ({
	label,
	href,
	isActive,
}: { label: string; href: string; isActive: () => boolean }) => {
	const styles = isActive()
		? "bg-primary rounded-full text-primary-foreground font-semibold text-[15px]"
		: "";
	return (
		<NavigationMenuItem>
			<Link href={href} legacyBehavior passHref>
				<NavigationMenuLink className={`px-4 py-1.5 select-none ${styles}`}>
					{label}
				</NavigationMenuLink>
			</Link>
		</NavigationMenuItem>
	);
};
