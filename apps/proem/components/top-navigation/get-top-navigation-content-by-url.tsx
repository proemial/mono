import { MenuButton } from "@/app/profile/menu-button";
import { Theme, themeForInstitution } from "@/app/theme/color-theme";
import { ActionMenu } from "@/components/nav-bar/actions/action-menu";
import { CloseAction } from "@/components/nav-bar/actions/close-action";
import { GoToSpaceAction } from "@/components/nav-bar/actions/go-to-space-action";
import { OpenSearchAction } from "@/components/nav-bar/actions/open-search-action";
import { SignInDrawer } from "@/components/sign-in-drawer";
import { routes } from "@/routes";
import { Edit05 } from "@untitled-ui/icons-react";
import Link from "next/link";

type TopNavigationContent = {
	/**
	 * The menu to be displayed in the nav bar
	 * defaults to the main menu
	 */
	menu?: JSX.Element;
	/**
	 * The title to be displayed in the nav bar
	 * defaults to the space selector
	 */
	title?: string;
	/**
	 * The action to be displayed in the nav bar
	 * defaults to close action back to home
	 */
	action?: JSX.Element;
	theme?: Theme;
};
export function getTopNavigationContentByUrl(
	url: string,
): TopNavigationContent {
	console.log(url);

	if (url.includes("/space")) {
		// All papers inside space
		if (url.includes("/paper")) {
			return {
				menu: <GoToSpaceAction />,
				action: (
					<ActionMenu>
						<Link href={`${url}/saved`}>Save Paper</Link>
						{/* <Link href={url.replace("/paper", "/search")}>Search</Link> */}
					</ActionMenu>
				),
			};
		}
		// "For you" feed for logged in users
		if (url.includes("/user_")) {
			// Saved bookmarks
			if (url.includes("/saved")) {
				return {
					action: (
						<ActionMenu>
							<Link href={url.replace("/saved", "")}>View Latest Items</Link>
						</ActionMenu>
					),
				};
			}
			return {
				action: (
					<ActionMenu>
						<Link href={`${url}/saved`}>View Saved Items</Link>
					</ActionMenu>
				),
			};
		}

		// Collection space
		if (url.includes("/col_")) {
			// Collections bookmarks
			if (url.includes("/search")) {
				return {
					action: <CloseAction target={url.replace("/search", "")} />,
				};
			}

			// Discover/latest feed
			return {
				action: (
					<ActionMenu>
						<Link href={`${url}/search`}>Search</Link>
					</ActionMenu>
				),
			};
		}

		// "For you" feed for anonymous users
		// app/space SignInDrawer + SignInDrawer
		// app/space/new <CloseAction target={routes.space} />
		return {
			menu: (
				<SignInDrawer
					trigger={
						// extra div to make the trigger a ref
						<div>
							<MenuButton />
						</div>
					}
				/>
			),
			title: "For You",
			action: (
				<ActionMenu>
					<SignInDrawer trigger={<div>View saved items</div>} />
				</ActionMenu>
			),
		};
	}

	// Papers outside of a space
	if (url.includes("/paper")) {
		return {
			menu: <GoToSpaceAction />,
			action: <CloseAction target={routes.space} />,
		};
	}
	if (url.includes("/org")) {
		// start with?
		return { title: "Organization Management" };
	}

	if (url.includes("/blocked")) {
		return { title: "Request Blocked" };
	}

	// ASK / ask	<CloseAction target={routes.space} />
	if (url.includes("/ask")) {
		// start with?

		// ASK answer / ask/answer	<CloseAction target={routes.ask} />
		if (url.includes("/answer")) {
			return {
				title: "Ask",
				action: (
					<CloseAction
						target={routes.ask}
						iconOverride={<Edit05 className="size-5" />}
					/>
				),
			};
		}

		return { title: "Ask", action: <CloseAction target={routes.space} /> };
	}

	if (url.includes("/share")) {
		return { title: "Ask", action: <CloseAction target={routes.space} /> };
	}
	if (url.includes("/discover")) {
		if (url.includes("/andrej-karpathy-llm-reading-list")) {
			return {
				title: "Andrej Karpathy's LLM Reading List",
				action: <OpenSearchAction />,
			};
		}
		if (url.includes("/hugs")) {
			return { title: "A hugging tribute to AK", action: <OpenSearchAction /> };
		}
		// app/discover/fingerprints <CloseAction target={routes.space} />
		if (url.includes("/fingerprints")) {
			return { action: <CloseAction target={routes.space} /> };
		}

		// Institution page
		if (url.includes("/discover/")) {
			const institution = url.split("/").at(-1);
			const shortName = institution?.split("(")[0] ?? institution;
			return {
				// TODO!: find a better way to do this
				title: shortName,
				action: <OpenSearchAction />,
				theme: institution && themeForInstitution(institution),
			};
		}
		return { action: <OpenSearchAction /> };
	}

	if (url.includes("/search")) {
		return { title: "Search" };
	}

	return {};
}
