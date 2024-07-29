"use client";

import { useInternalUser } from "@/app/hooks/use-user";
import { Profile } from "@/app/profile/profile";
import { Theme } from "@/components/theme";
import { routes } from "@/routes";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
} from "@proemial/shadcn-ui";
import { hex2rgba } from "@proemial/utils/color";
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

const bgColor = "#F5F5F5";

export const NavBar = ({ children, action }: Props) => {
	const pathname = usePathname();
	const params = useParams<{ id?: string; collectionId?: string }>();
	const isReaderPage = params.id && pathname.includes(routes.paper);
	const seed = params.collectionId ?? "";
	const image = Theme.image(seed);
	const color = Theme.color(seed);
	const { isInternal } = useInternalUser();
	const hasTheme = isInternal && seed.includes("col_");

	return (
		<>
			<NavigationMenu className="z-20 bg-transparent">
				<div
					className="absolute top-0 left-0 w-full h-full"
					style={{
						background: hasTheme
							? `url('/backgrounds/${
									image?.regular
								}'),linear-gradient(${hex2rgba(color, 1)} 0px, ${hex2rgba(
									color,
									1,
								)} 58px, transparent 72px)`
							: bgColor,
						maskImage:
							"linear-gradient(black 0px, black 54px, transparent 72px)",
						backgroundPosition: "top",
						backgroundAttachment: "fixed",
						backgroundSize: "50%",
					}}
				/>
				<NavigationMenuList className="justify-between flex-nowrap">
					<NavigationMenuItem>
						{isReaderPage ? <GoToSpaceAction /> : <Profile />}
					</NavigationMenuItem>
					<NavigationMenuItem className="truncate">
						{children}
					</NavigationMenuItem>
					<NavigationMenuItem>{action}</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>

			{hasTheme ? (
				<div
					className="w-full h-60 -top-32 -mt-16 left-0 sticky -mb-28"
					style={{
						backgroundImage: `url('/backgrounds/${image?.regular}')`,
						backgroundColor: color,
						maskImage: "linear-gradient(to top, transparent 0px, black 48px)",
						backgroundPosition: "top",
						backgroundAttachment: "fixed",
						backgroundSize: "50%",
					}}
				/>
			) : null}
		</>
	);
};
