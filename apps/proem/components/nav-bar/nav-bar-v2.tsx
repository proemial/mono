"use client";

import { Profile } from "@/app/profile/profile";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
} from "@proemial/shadcn-ui";
import { ReactNode } from "react";
import { NavigationMenuBar } from "../navigation-menu-bar";

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
	/**
	 * New nav bar will only be displayed for internal users.
	 * @deprecated This prop will be removed once we launch the collections
	 * feature which uses new navigation.
	 */
	isInternalUser: boolean;
};

export const NavBarV2 = ({ children, action, isInternalUser }: Props) => {
	// if (!isInternalUser) {
	return <NavigationMenuBar />;
	// }

	/**
	 * Disable until we launch the new nav bar.
	 */
	// return (
	// 	<NavigationMenu>
	// 		<NavigationMenuList className="justify-between flex-nowrap">
	// 			<NavigationMenuItem>
	// 				<Profile />
	// 			</NavigationMenuItem>
	// 			<NavigationMenuItem className="truncate">{children}</NavigationMenuItem>
	// 			<NavigationMenuItem>{action}</NavigationMenuItem>
	// 		</NavigationMenuList>
	// 	</NavigationMenu>
	// );
};
