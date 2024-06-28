import { fetchPaper } from "@/app/(pages)/(app)/paper/oa/[id]/fetch-paper";
import FeedItem from "@/app/(pages)/(app)/space/(discover)/feed-item";
import { getBookmarksByCollectionId } from "@/app/(pages)/(app)/space/(discover)/get-bookmarks-by-user-id";
import { getPaperIdsForCollection } from "@/app/(pages)/(app)/space/[collectionId]/collection-utils";
import { CollectionIdParams } from "@/app/(pages)/(app)/space/[collectionId]/params";
import { auth } from "@clerk/nextjs";
import { notFound } from "next/navigation";

type SavedPageProps = CollectionIdParams;

export default async function SavedPage({ params }: SavedPageProps) {
	const { userId } = auth();
	if (!params?.collectionId || !userId) {
		notFound();
	}
	const [paperIds, bookmarks] = await Promise.all([
		getPaperIdsForCollection(params.collectionId),
		getBookmarksByCollectionId(params.collectionId),
	]);

	if (paperIds?.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center gap-4">
				<div className="text-sm">You have yet to save a paper…</div>
			</div>
		);
	}

	const papers = paperIds
		? await Promise.all(paperIds.map((paperId) => fetchPaper(paperId)))
		: [];

	return (
		<div className="mb-8 space-y-8">
			{papers.map(
				(paper) =>
					paper && (
						<FeedItem key={paper.id} paper={paper} bookmarks={bookmarks} />
					),
			)}
		</div>
	);
}
