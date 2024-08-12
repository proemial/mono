"use client";
import {
	PERSONAL_DEFAULT_COLLECTION_NAME,
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
import {
	Button,
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
	cn,
} from "@proemial/shadcn-ui";
import { ChevronRight } from "@untitled-ui/icons-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import { useQuery } from "react-query";

export function TopNavigation() {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const { userId } = useAuth();

	const themeColor = searchParams.get("color");
	const themeImage = searchParams.get("image");
	const [{ url: optimisticUrl, name: optimisticName }, setOptimisticUrl] =
		useOptimistic<{
			url: string;
			name?: string;
		}>({ url: pathname });

	const collectionId = optimisticUrl.includes("/space/")
		? optimisticUrl.split("/")[2]
		: "";

	const { data: collections, isLoading } = useQuery({
		queryKey: ["collections-with-public", collectionId, userId],
		queryFn: async () => getAvailableCollections(collectionId),
	});

	const [pending, startTransition] = useTransition();

	const { action, title, menu, theme } =
		getTopNavigationContentByUrl(optimisticUrl);

	const selectedSpace = collectionId ?? collections?.at(0)?.id;

	const activeTheme = theme
		? theme
		: themeColor
			? asTheme(themeColor, themeImage)
			: fromSeed(collectionId ?? "");

	return (
		<>
			{activeTheme && <SetThemeColor color={activeTheme.color} />}

			<NavigationMenu className="z-20 bg-transparent">
				<div
					className={cn(
						"absolute top-0 left-0 w-full h-full overflow-hidden bg-theme-300",
						// {
						// 	"transition duration-1000 ease-in-out": activeTheme,
						// },
					)}
					style={{
						maskImage:
							"linear-gradient(black 0px, black 54px, transparent 72px)",
					}}
				>
					{activeTheme?.image && (
						<ThemeBackgroundImage
							className="opacity-75"
							// className={cn("transition-all opacity-75", {
							// 	"opacity-0": pending,
							// })}
							pattern={activeTheme.image}
						/>
					)}
				</div>

				<NavigationMenuList className="justify-between flex-nowrap">
					<NavigationMenuItem className="min-w-7">
						{menu ?? <Profile />}
					</NavigationMenuItem>
					<NavigationMenuItem className="truncate">
						{isLoading ? (
							<SelectSkeleton
								collectionId={collectionId}
								title={optimisticName}
							/>
						) : title ? (
							<SimpleHeader title={title} />
						) : !collections || collections.length <= 1 ? (
							<SimpleHeader title={PERSONAL_DEFAULT_COLLECTION_NAME} />
						) : (
							<SelectSpaceHeader
								collections={collections}
								selectedSpace={selectedSpace}
								onRouteChange={(url) =>
									startTransition(() => setOptimisticUrl(url))
								}
							/>
						)}
					</NavigationMenuItem>
					<NavigationMenuItem>
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
						className={cn("fixed top-0 bg-theme-300", {
							// "transition duration-1000 ease-in-out": activeTheme,
						})}
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
									className="opacity-75"
									// className={cn("transition-all opacity-75", {
									// 	"opacity-0": pending,
									// })}
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

const SelectSkeleton = ({
	collectionId,
	title,
}: { collectionId?: string; title?: string }) => (
	<Button variant="ghost">
		<div className="flex items-center gap-2">
			{title ? (
				<div className="text-lg">{title}</div>
			) : (
				<div className="h-6 w-[60px] bg-theme-200/75 rounded-md animate-pulse" />
			)}

			{collectionId && <ChevronRight className="w-4 h-4 opacity-75 mt-0.5" />}
		</div>
	</Button>
);
