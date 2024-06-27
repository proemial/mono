import { getBookmarksByUserId } from "@/app/(pages)/(app)/space/(discover)/get-bookmarks-by-user-id";
import { Main } from "@/components/main";
import { CloseAction } from "@/components/nav-bar/actions/close-action";
import { SimpleHeader } from "@/components/nav-bar/headers/simple-header";
import { NavBar } from "@/components/nav-bar/nav-bar";
import { routes } from "@/routes";
import { auth } from "@clerk/nextjs";
import { SearchForm } from "./search-form";

export default async function SearchPage() {
	const { userId } = await auth();
	const bookmarks = userId ? await getBookmarksByUserId(userId) : {};

	return (
		<>
			<NavBar action={<CloseAction target={routes.space} />}>
				<SimpleHeader title="Search" />
			</NavBar>
			<Main>
				<div className="space-y-6">
					<SearchForm bookmarks={bookmarks} />
				</div>
			</Main>
		</>
	);
}
