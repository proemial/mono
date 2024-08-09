import { getBookmarksByCollectionId } from "@/app/(pages)/(app)/space/(discover)/get-bookmarks-by-collection-id";
import { Main } from "@/components/main";
import { CloseAction } from "@/components/nav-bar/actions/close-action";
import { SimpleHeader } from "@/components/nav-bar/headers/simple-header";
import { NavBar } from "@/components/nav-bar/nav-bar";
import { routes } from "@/routes";
import { auth } from "@clerk/nextjs";
import { findPapers } from "./find-papers";
import { SearchForm } from "./search-form";

type Params = {
	searchParams?: {
		query: string;
	};
};

export default async function SearchPage({ searchParams }: Params) {
	const { userId } = auth();
	const bookmarks = userId ? await getBookmarksByCollectionId(userId) : {};

	const searchResults = searchParams?.query
		? await findPapers(searchParams.query)
		: undefined;

	return (
		<Main>
			<div className="space-y-6">
				<SearchForm
					bookmarks={bookmarks}
					searchQuery={searchParams?.query}
					initialSearchResults={searchResults}
				/>
			</div>
		</Main>
	);
}
