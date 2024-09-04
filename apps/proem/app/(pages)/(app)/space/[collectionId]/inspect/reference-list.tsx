import { fetchPaperWithPostsAndReaders } from "@/app/data/fetch-feed";
import { getPostBySlug } from "@proemial/data/repository/post";
import { FeedItemWithDisabledOverlay } from "../(lists)/saved/feed-item-with-disabled-overlay";
import { fetchPaper } from "../../../paper/oa/[id]/fetch-paper";
import { generate } from "../../../paper/oa/[id]/llm-generate";

type Props = {
	tuple: string;
	spaceId?: string;
};

export const ReferenceList = async ({ tuple, spaceId }: Props) => {
	const post = await getPostBySlug(tuple);
	const shallowPapers = (post?.comments[0]?.papers as { link: string }[]) ?? [];
	const paperIds = shallowPapers
		.map((paper) => paper.link.split("/").pop())
		.filter((id) => typeof id !== "undefined");
	const papers = await Promise.all(
		paperIds.map((id) => fetchAndGeneratePaper(id)),
	);
	const papersWithPostsAndReaders = await Promise.all(
		paperIds.map((paperId) => fetchPaperWithPostsAndReaders(paperId, spaceId)),
	);
	return (
		<div className="flex flex-col gap-6">
			{papers
				.filter((p) => typeof p !== "undefined")
				.map((paper, index) => (
					<FeedItemWithDisabledOverlay
						key={paper.id}
						paper={{
							...paper,
							posts:
								papersWithPostsAndReaders.find((p) => p.paperId === paper.id)
									?.posts ?? [],
							readers:
								papersWithPostsAndReaders.find((p) => p.paperId === paper.id)
									?.readers ?? [],
						}}
						customCollectionId={spaceId}
						isBookmarked={false}
						readonly={true}
						index={index + 1}
					/>
				))}
		</div>
	);
};

const fetchAndGeneratePaper = async (paperId: string) => {
	const paper = await fetchPaper(paperId);
	return paper ? await generate(paper) : undefined;
};
