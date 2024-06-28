import { SearchForm } from "@/app/(pages)/(app)/search/search-form";
import { getBookmarksByCollectionId } from "@/app/(pages)/(app)/space/(discover)/get-bookmarks-by-user-id";
import { auth } from "@clerk/nextjs";

export default async function SearchPage() {
	const { userId } = await auth();
	const bookmarks = userId ? await getBookmarksByCollectionId(userId) : {};

	return <SearchForm bookmarks={bookmarks} />;
}
