"use client";
import {
	PERSONAL_DEFAULT_COLLECTION_NAME,
	getPersonalDefaultCollection,
	screenMaxWidth,
} from "@/app/constants";
import { getAvailableCollections } from "@/app/profile/actions";
import { Profile } from "@/app/profile/profile";
import { asTheme, fromSeed } from "@/app/theme/color-theme";
import { CloseAction } from "@/components/nav-bar/actions/close-action";
import { SelectSpaceHeader } from "@/components/nav-bar/headers/select-space-header";
import { SimpleHeader } from "@/components/nav-bar/headers/simple-header";
import { SetThemeColor } from "@/components/set-theme-color";
import { ThemeBackgroundImage } from "@/components/theme-background-image";
import { getTopNavigationContentByUrl } from "@/components/top-navigation/get-top-navigation-content-by-url";
import { routes } from "@/routes";
import { useAuth } from "@clerk/nextjs";
import { Collection } from "@proemial/data/neon/schema";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
	cn,
} from "@proemial/shadcn-ui";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import { useQuery } from "react-query";

export function TopNavigation() {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const params = useParams<{ id?: string; collectionId?: string }>();
	const { userId } = useAuth();
	const { data: collections } = useQuery({
		queryKey: ["collections", userId],
		// TODO!: Missing public collections i'm not a part of
		queryFn: async () => getAvailableCollections(),
	});
	console.log({ collections });

	const themeColor = searchParams.get("color");
	const themeImage = searchParams.get("image");
	const [optimisticUrl, setOptimisticUrl] = useOptimistic(pathname);
	const [pending, startTransition] = useTransition();
	const seed = params.collectionId ?? "";

	const { action, title, menu, theme } =
		getTopNavigationContentByUrl(optimisticUrl);

	const collectionsWithDefaultFallback = ensureDefaultCollection(
		collections ?? [],
		userId ?? "",
	);
	// TODO: optimistic
	const selectedSpace =
		params.collectionId ?? collectionsWithDefaultFallback.at(0)?.id;

	const activeTheme = theme
		? theme
		: themeColor
			? asTheme(themeColor, themeImage)
			: fromSeed(seed);

	return (
		<>
			{activeTheme && <SetThemeColor color={activeTheme.color} />}

			<NavigationMenu className="z-20 bg-transparent">
				<div
					className="absolute top-0 left-0 w-full h-full overflow-hidden bg-theme-300"
					style={{
						maskImage:
							"linear-gradient(black 0px, black 54px, transparent 72px)",
					}}
				>
					{activeTheme?.image && (
						<ThemeBackgroundImage
							className={cn("opacity-75", {
								// "opacity-0": pending,
							})}
							pattern={activeTheme.image}
						/>
					)}
				</div>

				<NavigationMenuList className="justify-between flex-nowrap">
					<NavigationMenuItem className="min-w-7">
						{menu === null ? null : menu ?? <Profile />}
					</NavigationMenuItem>
					<NavigationMenuItem className="truncate">
						{title ? (
							<SimpleHeader title={title} />
						) : userId ? (
							<SelectSpaceHeader
								collections={collectionsWithDefaultFallback}
								selectedSpace={selectedSpace}
								onRouteChange={(url) =>
									startTransition(() => setOptimisticUrl(url))
								}
							/>
						) : (
							<SimpleHeader title={PERSONAL_DEFAULT_COLLECTION_NAME} />
						)}
					</NavigationMenuItem>
					<NavigationMenuItem className="min-w-7">
						{action === null
							? null
							: action ?? <CloseAction target={routes.home} />}
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>

			{activeTheme && (
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
							{activeTheme.image && (
								<ThemeBackgroundImage
									className={cn("opacity-75", {
										// "opacity-0": pending,
									})}
									pattern={activeTheme.image}
								/>
							)}
						</div>
					</div>
				</div>
			)}
		</>
	);
}

const ensureDefaultCollection = (
	collections: Collection[],
	userId: string | null,
) => {
	const existingDefaultCollection = collections.find(
		(collection) => collection.id === userId,
	);
	if (existingDefaultCollection) {
		return collections;
	}
	return userId
		? [getPersonalDefaultCollection(userId), ...collections]
		: collections;
};
