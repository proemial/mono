import { fetchPaper } from "@/app/(pages)/(app)/paper/oa/[id]/fetch-paper";
import FeedItem from "@/app/(pages)/(app)/space/(discover)/feed-item";
import { getBookmarkedPapersByCollectionId } from "@/app/(pages)/(app)/space/(discover)/get-bookmarked-papers-by-collection-id";
import { getFieldFromOpenAlexTopics } from "@/app/(pages)/(app)/space/(discover)/get-field-from-open-alex-topics";
import { CollectionIdParams } from "@/app/(pages)/(app)/space/[collectionId]/params";
import { fetchPaperWithPostsAndReaders } from "@/app/data/fetch-paper-with-posts-and-readers";
import { FeatureCloud } from "@/components/feature-badges";
import { DebugInfo } from "@/components/features/legend";
import { ThemeColoredCard } from "@/components/theme-colored-card";
import { getDebugFlags } from "@/feature-flags/debug-flag";
import { routes } from "@/routes";
import { CollectionService } from "@/services/collection-service";
import { PermissionUtils } from "@/utils/permission-utils";
import { auth } from "@clerk/nextjs/server";
import { getFeatures } from "@proemial/repositories/oa/fingerprinting/features";
import { getFingerprint } from "@proemial/repositories/oa/fingerprinting/fingerprints";
import { Button } from "@proemial/shadcn-ui";
import { FilePlus03 } from "@untitled-ui/icons-react";
import Link from "next/link";
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
	const bookmarkedPapersInCurrentSpace = bookmarkedPapers?.map(
		(paper) => paper.paperId,
	);

	if (
		!bookmarkedPapersInCurrentSpace ||
		bookmarkedPapersInCurrentSpace?.length === 0
	) {
		return (
			<div className="flex flex-col items-center justify-center gap-12">
				<div className="text-gray-600 text-center">
					Get a news feed of the latest published science based on papers of
					your choice.
					<br />
					<br />
					Let's save the first paper to this space.
				</div>
				<Link href={`${routes.space}/${collectionId}/search`}>
					<Button className="flex items-center gap-2">
						<FilePlus03 className="size-4" /> Add paper
					</Button>
				</Link>
			</div>
		);
	}

	const papers = bookmarkedPapersInCurrentSpace
		? await Promise.all(
				bookmarkedPapersInCurrentSpace.map((paperId) => fetchPaper(paperId)),
			)
		: [];

	const papersWithPostsAndReaders = await Promise.all(
		bookmarkedPapersInCurrentSpace.map((paperId) =>
			fetchPaperWithPostsAndReaders(paperId, collection.id),
		),
	);

	const [debug] = await getDebugFlags();

	const isDefaultSpace = collectionId === userId;
	const showThemeColors = isDefaultSpace;
	return (
		<>
			{debug && <DebugInfo className="mb-4" count={papers.length} />}
			<div className="mb-8 space-y-3">
				<div className="flex justify-center my-6">
					<Link href={`${routes.space}/${collectionId}/search`}>
						<Button variant="suggestion" className="flex items-center gap-2">
							<FilePlus03 className="size-4" /> Add another paper
						</Button>
					</Link>
				</div>
				{papers.map((paper) => {
					if (!paper) return null;
					const isBookmarked =
						bookmarkedPapersInCurrentSpace?.includes(paper.id) ?? false;
					const topics = paper.data.topics;
					const field = topics && getFieldFromOpenAlexTopics(topics);
					const item = (
						<FeedItem
							paper={{
								...paper,
								posts:
									papersWithPostsAndReaders.find((p) => p.paperId === paper.id)
										?.posts ?? [],
								readers:
									papersWithPostsAndReaders.find((p) => p.paperId === paper.id)
										?.readers ?? [],
							}}
							isBookmarked={isBookmarked}
							customCollectionId={collectionId}
							readonly={!canEdit}
						>
							{debug && (
								<FeatureCloud
									features={getFeatures(getFingerprint(paper))}
									// sum={row.filterMatchScore}
								/>
							)}
						</FeedItem>
					);

					if (showThemeColors && field?.theme) {
						return (
							<ThemeColoredCard theme={field.theme} key={paper.id}>
								{item}
							</ThemeColoredCard>
						);
					}
					return (
						<div
							className="bg-white hover:shadow p-3.5 rounded-2xl"
							key={paper.id}
						>
							{item}
						</div>
					);
				})}
			</div>
		</>
	);
}
