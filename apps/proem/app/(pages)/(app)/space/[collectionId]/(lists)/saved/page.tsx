import { fetchPaper } from "@/app/(pages)/(app)/paper/oa/[id]/fetch-paper";
import { getBookmarkedPapersByCollectionId } from "@/app/(pages)/(app)/space/(discover)/get-bookmarked-papers-by-collection-id";
import { FeedItemWithDisabledOverlay } from "@/app/(pages)/(app)/space/[collectionId]/(lists)/saved/feed-item-with-disabled-overlay";
import { CollectionIdParams } from "@/app/(pages)/(app)/space/[collectionId]/params";
import { ProemAssistant } from "@/components/proem-assistant";
import { CollectionService } from "@/services/collection-service";
import { PermissionUtils } from "@/utils/permission-utils";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

type SavedPageProps = CollectionIdParams;

export default async function SavedPage({
	params: { collectionId },
}: SavedPageProps) {
	const { userId, orgId } = auth();
	const collection = await CollectionService.getCollection(
		collectionId,
		userId,
		orgId,
	);
	if (!collection) {
		notFound();
	}
	const canEdit = PermissionUtils.canEditCollection(collection, userId, orgId);

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
						<FeedItemWithDisabledOverlay
							key={paper.id}
							paper={paper}
							isBookmarked={isBookmarked}
							customCollectionId={collectionId}
							readonly={!canEdit}
						/>
					);
				})}
			</div>
			<ProemAssistant />
		</>
	);
}
