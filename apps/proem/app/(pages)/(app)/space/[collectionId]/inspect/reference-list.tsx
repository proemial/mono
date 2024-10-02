import { fetchPaperWithPostsAndReaders } from "@/app/data/fetch-paper-with-posts-and-readers";
import { User } from "@/app/data/user";
import { Tuple } from "@/components/proem-assistant/tuple";
import { getPostBySlug } from "@proemial/data/repository/post";
import { Header4 } from "@proemial/shadcn-ui";
import { nanoid } from "ai";
import { FeedItemWithDisabledOverlay } from "../(lists)/saved/feed-item-with-disabled-overlay";
import { fetchPaper } from "../../../paper/oa/[id]/fetch-paper";
import { generate } from "../../../paper/oa/[id]/llm-generate";
import { getFieldFromOpenAlexTopics } from "../../(discover)/get-field-from-open-alex-topics";
import { ThemeColoredCard } from "@/components/theme-colored-card";

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
	const author = post?.authorId ? await User.getUser(post.authorId) : undefined;

	return (
		<div className="flex flex-col gap-4">
			<Header4>Q&A</Header4>
			{post && (
				<div className="drop-shadow-sm">
					<Tuple
						post={{
							id: nanoid(),
							createdAt: new Date(post.createdAt),
							content: post.content,
							author: {
								id: post.authorId,
								firstName: author?.firstName ?? null,
								lastName: author?.lastName ?? null,
								imageUrl: author?.imageUrl,
							},
							slug: post.slug,
							reply: post.comments[0] && {
								content: post.comments[0].content,
								metadata: {
									authorId: post.comments[0].authorId,
									followUps: post.comments[0].followUps,
									papers: post.comments[0].papers,
								},
							},
						}}
					/>
				</div>
			)}
			<Header4>Papers referenced</Header4>
			<div className="flex flex-col gap-3">
				{papers
					.filter((p) => typeof p !== "undefined")
					.map((paper, index) => {
						const topics = paper.data.topics;
						const field = topics && getFieldFromOpenAlexTopics(topics);
						const item = (
							<FeedItemWithDisabledOverlay
								key={paper.id}
								paper={{
									...paper,
									posts:
										papersWithPostsAndReaders.find(
											(p) => p.paperId === paper.id,
										)?.posts ?? [],
									readers:
										papersWithPostsAndReaders.find(
											(p) => p.paperId === paper.id,
										)?.readers ?? [],
								}}
								customCollectionId={spaceId}
								isBookmarked={false}
								readonly={true}
								index={index + 1}
							/>
						);
						if (field) {
							return (
								<ThemeColoredCard theme={field?.theme}>{item}</ThemeColoredCard>
							);
						}
						return item;
					})}
			</div>
		</div>
	);
};

const fetchAndGeneratePaper = async (paperId: string) => {
	const paper = await fetchPaper(paperId);
	return paper ? await generate(paper) : undefined;
};
