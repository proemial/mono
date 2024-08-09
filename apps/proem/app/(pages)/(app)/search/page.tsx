import { getBookmarksByCollectionId } from "@/app/(pages)/(app)/space/(discover)/get-bookmarks-by-collection-id";
import { Main } from "@/components/main";
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
