import { fetchPaperWithPosts } from "@/app/data/fetch-feed";
import { getPostBySlug } from "@proemial/data/repository/post";
import { FeedItemWithDisabledOverlay } from "../(lists)/saved/feed-item-with-disabled-overlay";
import { fetchPaper } from "../../../paper/oa/[id]/fetch-paper";
import { generate } from "../../../paper/oa/[id]/llm-generate";

type Props = {
	spaceId: string;
	tuple: string;
};

export const ReferenceList = async ({ spaceId, tuple }: Props) => {
	const post = await getPostBySlug(tuple);
	const shallowPapers = (post?.comments[0]?.papers as { link: string }[]) ?? [];
	const paperIds = shallowPapers
		.map((paper) => paper.link.split("/").pop())
		.filter((id) => typeof id !== "undefined");
	const papers = await Promise.all(
		paperIds.map((id) => fetchAndGeneratePaper(id)),
	);
	const papersWithPosts = await Promise.all(
		paperIds.map((paperId) => fetchPaperWithPosts(paperId, spaceId)),
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
								papersWithPosts.find((p) => p.paperId === paper.id)?.posts ??
								[],
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
