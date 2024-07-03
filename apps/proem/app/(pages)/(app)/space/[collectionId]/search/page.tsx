import { SearchForm } from "@/app/(pages)/(app)/search/search-form";
import { getBookmarksByCollectionId } from "@/app/(pages)/(app)/space/(discover)/get-bookmarks-by-collection-id";
import { routes } from "@/routes";
import { auth } from "@clerk/nextjs";
import { isPublicSpace } from "@proemial/data/lib/create-id";
import { redirect } from "next/navigation";
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

	// Disallow access to other users' default space, but reopen search under user's space
	if (collectionId !== userId && !isPublicSpace(collectionId)) {
		if (searchParams?.query) {
			redirect(
				`${routes.space}/${userId}${routes.search}?query=${searchParams.query}`,
			);
		} else {
			redirect(`${routes.space}/${userId}${routes.search}`);
		}
	}

	const searchResults = searchParams?.query
		? await findPapers(searchParams.query)
		: undefined;

	return (
		<SearchForm
			bookmarks={bookmarks}
			collectionId={collectionId}
			searchQuery={searchParams?.query}
			initialSearchResults={searchResults}
		/>
	);
}
