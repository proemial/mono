import { SearchForm } from "@/app/(pages)/(app)/search/search-form";
import { getBookmarksByCollectionId } from "@/app/(pages)/(app)/space/(discover)/get-bookmarks-by-collection-id";
import { auth } from "@clerk/nextjs";

type Params = {
	params: {
		collectionId: string;
	};
};

export default async function SearchPage({ params: { collectionId } }: Params) {
	const { userId } = auth();
	const bookmarks = userId
		? await getBookmarksByCollectionId(collectionId)
		: {};

	return <SearchForm bookmarks={bookmarks} collectionId={collectionId} />;
}
