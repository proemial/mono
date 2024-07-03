"use client";

import { Profile } from "@/app/profile/profile";
import { routes } from "@/routes";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
} from "@proemial/shadcn-ui";
import { useParams, usePathname } from "next/navigation";
import { ReactNode } from "react";
import { GoToSpaceAction } from "./actions/go-to-space-action";

type Props = {
	/**
	 * The "header" content to display in the center of the navigation bar, e.g.
	 * a title, a dropdown etc.
	 */
	children?: ReactNode;
	/**
	 * The "action" content to display on the right side of the navigation bar,
	 * e.g. an icon button.
	 */
	action?: ReactNode;
};

export const NavBar = ({ children, action }: Props) => {
	const pathname = usePathname();
	const params = useParams<{ id?: string }>();
	const isReaderPage = params.id && pathname.includes(routes.paper);
	return (
		<NavigationMenu>
			<NavigationMenuList className="justify-between flex-nowrap">
				<NavigationMenuItem>
					{isReaderPage ? <GoToSpaceAction /> : <Profile />}
				</NavigationMenuItem>
				<NavigationMenuItem className="truncate">{children}</NavigationMenuItem>
				<NavigationMenuItem>{action}</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
};
