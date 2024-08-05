import { fetchPaper } from "@/app/(pages)/(app)/paper/oa/[id]/fetch-paper";
import { getBookmarkedPapersByCollectionId } from "@/app/(pages)/(app)/space/(discover)/get-bookmarked-papers-by-collection-id";
import { getFieldFromOpenAlexTopics } from "@/app/(pages)/(app)/space/(discover)/get-field-from-open-alex-topics";
import { FeedItemWithDisabledOverlay } from "@/app/(pages)/(app)/space/[collectionId]/(lists)/saved/feed-item-with-disabled-overlay";
import { CollectionIdParams } from "@/app/(pages)/(app)/space/[collectionId]/params";
import { ProemAssistant } from "@/components/proem-assistant";
import { ThemeColoredCard } from "@/components/theme-colored-card";
import { CollectionService } from "@/services/collection-service";
import { PostService } from "@/services/post-service";
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
	const paperIdsWithPosts = await PostService.getPaperIdsWithPosts(
		papers.filter((p) => typeof p !== "undefined").map((p) => p.id),
		collectionId,
	);

	return (
		<>
			<div className="pb-20">
				{papers.map((paper) => {
					if (!paper) return null;
					const isBookmarked = paperIds?.includes(paper.id) ?? false;
					const topics = paper.data.topics;
					const field = topics && getFieldFromOpenAlexTopics(topics);
					const item = (
						<FeedItemWithDisabledOverlay
							key={paper.id}
							paper={{
								...paper,
								posts:
									paperIdsWithPosts.find((p) => p.id === paper.id)?.posts ?? [],
							}}
							isBookmarked={isBookmarked}
							customCollectionId={collectionId}
							readonly={!canEdit}
						/>
					);

					if (field?.theme) {
						return (
							<ThemeColoredCard className="mb-3" theme={field.theme}>
								{item}
							</ThemeColoredCard>
						);
					}
					return (
						<div key={paper.id} className="py-5">
							{item}
						</div>
					);
				})}
			</div>
			<ProemAssistant />
		</>
	);
}
