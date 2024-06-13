"use client";

import { Profile } from "@/app/profile/profile";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
} from "@proemial/shadcn-ui";
import { ReactNode } from "react";

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

export const NavBarV2 = ({ children, action }: Props) => {
	return (
		<NavigationMenu>
			<NavigationMenuList className="justify-between flex-nowrap">
				<NavigationMenuItem>
					<Profile />
				</NavigationMenuItem>
				<NavigationMenuItem className="truncate">{children}</NavigationMenuItem>
				<NavigationMenuItem>{action}</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
};
