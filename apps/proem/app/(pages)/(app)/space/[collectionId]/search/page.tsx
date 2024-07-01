import { SearchForm } from "@/app/(pages)/(app)/search/search-form";
import { getBookmarksByCollectionId } from "@/app/(pages)/(app)/space/(discover)/get-bookmarks-by-collection-id";
import { auth } from "@clerk/nextjs";
import { findPapers } from "../../../search/find-papers";

type Params = {
	params: {
		collectionId: string;
	};
	searchParams?: {
		query: string;
	};
};

export default async function SearchPage({
	params: { collectionId },
	searchParams,
}: Params) {
	const { userId } = auth();
	const bookmarks = userId
		? await getBookmarksByCollectionId(collectionId)
		: {};

	const searchResults = searchParams?.query
		? await findPapers(searchParams.query)
		: undefined;

	return (
		<SearchForm
			bookmarks={bookmarks}
			collectionId={collectionId}
			searchQuery={searchParams?.query}
			searchResults={searchResults}
		/>
	);
}
