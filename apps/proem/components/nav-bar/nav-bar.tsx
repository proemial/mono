"use client";

import { screenMaxWidth } from "@/app/constants";
import { Profile } from "@/app/profile/profile";
import {
	ThemeColor,
	ThemePatterns,
	getRandomThemeColor,
} from "@/app/theme/color-theme";
import { SetThemeColor } from "@/components/set-theme-color";
import { ThemeBackgroundImage } from "@/components/theme-background-image";
import { routes } from "@/routes";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
	cn,
} from "@proemial/shadcn-ui";
import { useParams, usePathname, useSearchParams } from "next/navigation";
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
	const searchParams = useSearchParams();
	const themeColor = searchParams.get("color");
	const themeImage = searchParams.get("image");
	const params = useParams<{ id?: string; collectionId?: string }>();
	const isReaderPage = params.id && pathname.includes(routes.paper);
	const seed = params.collectionId ?? "";
	const theme = themeColor
		? {
				color: themeColor as ThemeColor,
				image: themeImage as ThemePatterns,
			}
		: seed.includes("col_")
			? getRandomThemeColor(seed)
			: null;

	return (
		<>
			{theme && <SetThemeColor color={theme.color} />}
			<NavigationMenu className="z-20 bg-transparent">
				<div
					className="absolute top-0 left-0 w-full h-full overflow-hidden bg-gradient-to-b from-80% from-theme-300 to-transparent "
					style={{
						maskImage:
							"linear-gradient(black 0px, black 54px, transparent 72px)",
					}}
				>
					{theme?.image && (
						<ThemeBackgroundImage
							className="opacity-75"
							pattern={theme.image}
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

			{theme && (
				<div
					className="w-full h-72 -top-40 -mt-[72px] left-0 sticky -mb-36"
					style={{
						maskImage: "linear-gradient(to top, transparent 0px, black 56px)",
					}}
				>
					<div
						className="fixed top-0 bg-theme-300"
						style={{
							maskImage:
								"linear-gradient(to bottom, black 0px , black 72px, transparent)",
						}}
					>
						<div
							className={cn("mx-auto w-screen h-72", screenMaxWidth)}
							style={{
								maskImage:
									"linear-gradient(to bottom, black 0px , black 72px, transparent)",
							}}
						>
							{theme.image && (
								<ThemeBackgroundImage
									className="opacity-75"
									pattern={theme.image}
								/>
							)}
						</div>
					</div>
				</div>
			)}
		</>
	);
};
