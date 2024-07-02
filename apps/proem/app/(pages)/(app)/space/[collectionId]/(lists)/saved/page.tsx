import { fetchPaper } from "@/app/(pages)/(app)/paper/oa/[id]/fetch-paper";
import FeedItem from "@/app/(pages)/(app)/space/(discover)/feed-item";
import { getBookmarkedPapersByCollectionId } from "@/app/(pages)/(app)/space/(discover)/get-bookmarked-papers-by-collection-id";
import { CollectionIdParams } from "@/app/(pages)/(app)/space/[collectionId]/params";
import { ProemAssistant } from "@/components/proem-assistant";
import { auth } from "@clerk/nextjs";
import { notFound } from "next/navigation";

type SavedPageProps = CollectionIdParams;

export default async function SavedPage({ params }: SavedPageProps) {
	const { userId } = auth();
	const collectionId = params?.collectionId;
	if (!collectionId || !userId) {
		notFound();
	}

	const bookmarkedPapers =
		await getBookmarkedPapersByCollectionId(collectionId);

	const paperIds = bookmarkedPapers?.map(({ paperId }) => paperId);

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
		<>
			<div className="mb-8 space-y-8">
				{papers.map((paper) => {
					if (!paper) return null;
					const isBookmarked = paperIds?.includes(paper.id) ?? false;
					return (
						<FeedItem
							key={paper.id}
							paper={paper}
							isBookmarked={isBookmarked}
							customCollectionId={collectionId}
						/>
					);
				})}
			</div>
			<ProemAssistant />
		</>
	);
}
