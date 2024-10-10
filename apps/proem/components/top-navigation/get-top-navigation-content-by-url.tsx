import { PERSONAL_DEFAULT_COLLECTION_NAME } from "@/app/constants";
import { MenuButton } from "@/app/profile/menu-button";
import { Theme } from "@/app/theme/color-theme";
import { brandingForInstitution } from "@/app/theme/institution-branding";
import { ActionMenu } from "@/components/nav-bar/actions/action-menu";
import { CloseAction } from "@/components/nav-bar/actions/close-action";
import { GoToSpaceAction } from "@/components/nav-bar/actions/go-to-space-action";
import { OpenSearchAction } from "@/components/nav-bar/actions/open-search-action";
import { ShowOnboarding } from "@/components/top-navigation/top-nav-showOnboarding";
import { SignInDrawer } from "@/components/sign-in-drawer";
import { routes } from "@/routes";
import { ChevronLeft, Edit05 } from "@untitled-ui/icons-react";
import Link from "next/link";
import { setCookie, getCookie } from "cookies-next";

type TopNavigationContent = {
	/**
	 * The menu to be displayed in the nav bar
	 * defaults to the main menu
	 * null means no menu
	 */
	menu?: JSX.Element | null;
	/**
	 * The title to be displayed in the nav bar
	 * defaults to the space selector
	 */
	title?: string;
	/**
	 * The action to be displayed in the nav bar
	 * defaults to close action back to home
	 * null means no action
	 */
	action?: JSX.Element | null;
	theme?: Theme;
};
export function getTopNavigationContentByUrl(
	url: string,
): TopNavigationContent {
	if (url.includes("/space")) {
		// All papers inside space
		if (url.includes("/paper")) {
			return {
				menu: <GoToSpaceAction />,
				action: null,
			};
		}

		if (url.includes("/inspect")) {
			return {
				menu: <GoToSpaceAction />,
				title: "Papers referenced",
				action: null,
			};
		}

		if (url.includes("/search")) {
			return {
				action: <CloseAction />,
			};
		}

		// "For you" feed for logged in users
		if (url.includes("/user_")) {
			if (url.includes("/saved")) {
				return {
					action: (
						<ActionMenu>
							<Link href={url.replace("/saved", "")}>View Latest Items</Link>
							<ShowOnboarding />
						</ActionMenu>
					),
				};
			}

			return {
				action: (
					<ActionMenu>
						<Link href={`${url}/saved`}>View Saved Items</Link>
						<ShowOnboarding />
					</ActionMenu>
				),
			};
		}

		// Collection space
		if (url.includes("/col_")) {
			// Discover/latest feed
			return {
				action: null,
			};
		}

		return {
			title: PERSONAL_DEFAULT_COLLECTION_NAME,
			action: null,
		};
	}

	// Papers outside of a space
	if (url.includes("/paper")) {
		return {
			menu: <CloseAction iconOverride={<ChevronLeft className="size-6" />} />,
			action: null,
		};
	}

	if (url.includes("/inspect")) {
		return {
			menu: <GoToSpaceAction />,
			title: "Papers referenced",
			action: null,
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
			const institution = decodeURI(url).split("/").at(-1);
			const shortName = institution?.split("(")[0] ?? institution;
			return {
				// TODO!: find a better way to do this
				title: shortName,
				action: <OpenSearchAction />,
				theme: institution
					? brandingForInstitution(institution).theme
					: undefined,
			};
		}
		return { action: <OpenSearchAction /> };
	}

	if (url.includes("/search")) {
		return { title: "Search" };
	}

	return {};
}
