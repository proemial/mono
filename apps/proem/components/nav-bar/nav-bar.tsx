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
	const theme = seed.includes("col_")
		? getRandomThemeColor(seed)
		: seed.includes("user_")
			? themeColor
				? {
						color: themeColor as ThemeColor,
						image: themeImage as ThemePatterns,
					}
				: null
			: null;

	return (
		<>
			{theme && <SetThemeColor color={theme.color} />}
			<NavigationMenu className="z-20 bg-transparent">
				<div
					className="absolute top-0 left-0 w-full h-full overflow-hidden bg-gradient-to-b from-80% from-theme-400 to-transparent"
					style={{
						maskImage:
							"linear-gradient(black 0px, black 54px, transparent 72px)",
					}}
				>
					{theme?.image && (
						<ThemeBackgroundImage
							src={`/backgrounds/patterns_${theme.image}.png`}
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
					className="w-full h-60 -top-32 -mt-[72px] left-0 sticky -mb-36"
					style={{
						maskImage: "linear-gradient(to top, transparent 0px, black 56px)",
					}}
				>
					<div
						className="fixed top-0 bg-theme-400"
						style={{
							maskImage:
								"linear-gradient(to bottom, black 0px , black 72px, transparent)",
						}}
					>
						<div className={cn("mx-auto w-screen h-60", screenMaxWidth)}>
							{theme.image && (
								<ThemeBackgroundImage
									src={`/backgrounds/patterns_${theme.image}.png`}
								/>
							)}
						</div>
					</div>
				</div>
			)}
		</>
	);
};
