import { getBookmarksByUserId } from "@/app/(pages)/(app)/discover/get-bookmarks-by-user-id";
import { getInternalUser } from "@/app/hooks/get-internal-user";
import { Main } from "@/components/main";
import { CloseAction } from "@/components/nav-bar/actions/close-action";
import { SimpleHeader } from "@/components/nav-bar/headers/simple-header";
import { NavBarV2 } from "@/components/nav-bar/nav-bar-v2";
import { routes } from "@/routes";
import { auth } from "@clerk/nextjs";
import { SearchForm } from "./search-form";

export default async function SearchPage() {
	const { isInternal } = getInternalUser();
	const { userId } = await auth();
	const bookmarks = userId ? await getBookmarksByUserId(userId) : {};

	return (
		<>
			<NavBarV2
				action={<CloseAction target={routes.discover} />}
				isInternalUser={isInternal}
			>
				<SimpleHeader title="Search" />
			</NavBarV2>
			<Main>
				<div className="space-y-6">
					<SearchForm bookmarks={bookmarks} />
				</div>
			</Main>
		</>
	);
}
