import { SearchForm } from "@/app/(pages)/(app)/search/search-form";
import { getBookmarksByCollectionId } from "@/app/(pages)/(app)/space/(discover)/get-bookmarks-by-collection-id";
import { routes } from "@/routes";
import { CollectionService } from "@/services/collection-service";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { findPapers } from "../../../search/find-papers";
import { CollectionIdParams } from "../params";

type Params = CollectionIdParams & {
	searchParams?: {
		query: string;
	};
};

export default async function SearchPage({
	params: { collectionId },
	searchParams,
}: Params) {
	const { userId, orgId } = auth();
	const bookmarks = userId
		? await getBookmarksByCollectionId(collectionId)
		: {};

	const collection = await CollectionService.getCollection(
		collectionId,
		userId,
		orgId,
	);
	if (!collection) {
		// If no space permissions, reopen search under user's space
		if (searchParams?.query) {
			redirect(
				`${routes.space}/${userId}${routes.search}?query=${searchParams.query}`,
			);
		} else {
			if (userId) {
				redirect(`${routes.space}/${userId}${routes.search}`);
			} else {
				redirect(routes.search);
			}
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
