"use client";

import { screenMaxWidth } from "@/app/constants";
import { Profile } from "@/app/profile/profile";
import { SetThemeColor } from "@/components/set-theme-color";
import { Theme } from "@/components/theme";
import { ThemeBackgroundImage } from "@/components/theme-background-image";
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

const defaultBgColor = "#F5F5F5";

export const NavBar = ({ children, action }: Props) => {
	const pathname = usePathname();
	const params = useParams<{ id?: string; collectionId?: string }>();
	const isReaderPage = params.id && pathname.includes(routes.paper);
	const seed = params.collectionId ?? "";
	const hasTheme = seed.includes("col_");
	const theme = {
		image: hasTheme ? Theme.image(seed) : null,
		color: hasTheme ? Theme.color(seed) : defaultBgColor,
	};

	return (
		<>
			<SetThemeColor color={theme.color} />
			<NavigationMenu className="z-20 bg-transparent">
				<div
					className="absolute top-0 left-0 w-full h-full overflow-hidden"
					style={{
						background: `linear-gradient(${hex2rgba(
							theme.color,
							1,
						)} 0px, ${hex2rgba(theme.color, 1)} 58px, transparent 72px)`,
						maskImage:
							"linear-gradient(black 0px, black 54px, transparent 72px)",
					}}
				>
					{hasTheme && (
						<ThemeBackgroundImage
							src={`/backgrounds/${theme.image?.regular}`}
						/>
					)}
				</div>

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
					className="w-full h-60 -top-32 -mt-[72px] left-0 sticky -mb-36"
					style={{
						maskImage: "linear-gradient(to top, transparent 0px, black 56px)",
					}}
				>
					<div
						className="fixed top-0"
						style={{
							backgroundColor: theme.color,
							maskImage:
								"linear-gradient(to bottom, black 0px , black 72px, transparent)",
						}}
					>
						<div className={cn("mx-auto w-screen h-60", screenMaxWidth)}>
							<ThemeBackgroundImage
								src={`/backgrounds/${theme.image?.regular}`}
							/>
						</div>
					</div>
				</div>
			) : null}
		</>
	);
};
