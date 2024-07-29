"use client";

import { Profile } from "@/app/profile/profile";
import { Theme } from "@/components/theme";
import { routes } from "@/routes";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
	cn,
} from "@proemial/shadcn-ui";
import { hex2rgba } from "@proemial/utils/color";
import Image from "next/image";
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

// TODO! add as top background background on phone?
// TODO! accept images?
// TODO! Can this setup work when parameters is stored in the collection? (image, color, etc)
// TODO! Move to css variables
// TODO! Name both components

const bgColor = "#F5F5F5";

export const NavBar = ({ children, action }: Props) => {
	const pathname = usePathname();
	const params = useParams<{ id?: string; collectionId?: string }>();
	const isReaderPage = params.id && pathname.includes(routes.paper);
	const seed = params.collectionId ?? "";
	// TODO! refactor theme
	const image = Theme.image(seed);
	const color = Theme.color(seed);
	// TODO! Add unstyled
	const unstyled = false;

	return (
		<>
			<NavigationMenu className="z-20">
				<div
					className="absolute top-0 left-0 w-full h-full"
					style={{
						backgroundImage: `url('/backgrounds/${
							image?.regular
						}'),linear-gradient(${hex2rgba(color, 1)} 0px, ${hex2rgba(
							color,
							1,
						)} 58px, transparent 72px)`,
						maskImage:
							"linear-gradient(black 0px, black 54px, transparent 72px)",
						backgroundPosition: "top",
						backgroundAttachment: "fixed",
						backgroundSize: "75%",
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

			<div
				className="w-full h-60 -top-32 -mt-16 left-0 sticky -mb-32"
				style={{
					backgroundImage: `url('/backgrounds/${image?.regular}')`,
					backgroundColor: color,
					maskImage: "linear-gradient(to top, transparent 0px, black 48px)",
					backgroundPosition: "top",
					backgroundAttachment: "fixed",
					backgroundSize: "75%",
				}}
			/>
		</>
	);
};
