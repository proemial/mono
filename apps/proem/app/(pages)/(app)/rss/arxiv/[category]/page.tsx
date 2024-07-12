import { getBookmarksByCollectionId } from "@/app/(pages)/(app)/space/(discover)/get-bookmarks-by-collection-id";
import { PostService } from "@/services/post-service";
import { auth } from "@clerk/nextjs";
import { Redis } from "@proemial/redis/redis";
import { Metadata } from "next";
import { Suspense } from "react";
import { generate } from "../../../paper/oa/[id]/llm-generate";
import FeedItem, { FeedItemProps } from "../../../space/(discover)/feed-item";
import { fetchRssItems as fetchArXivRssPapers } from "../../fetch-rss";

export const dynamic = "force-static";

const title = "arXiv papers";

export const metadata: Metadata = {
	title,
	robots: {
		index: true,
		follow: false,
	},
};

type Props = {
	params: {
		category: string;
	};
};

export default async function ArXivRss({ params: { category } }: Props) {
	return (
		<div className="pb-10 space-y-5">
			<div className="text-[28px] font-normal pt-6">
				Latest {title} for {category}
			</div>
			<div
				className="relative w-full"
				style={{
					height: 5,
				}}
			>
				<div
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						width: "100%",
					}}
				>
					<Suspense fallback={<div>loading...</div>}>
						<Papers category={category} />
					</Suspense>
				</div>
			</div>
		</div>
	);
}
async function Papers({ category }: { category: string }) {
	const { userId } = await auth();
	const papers = await fetchArXivRssPapers(
		`https://rss.arxiv.org/atom/${category}`,
	);
	const bookmarks = userId ? await getBookmarksByCollectionId(userId) : {};

	return (
		<>
			{!papers.length && <div>No papers found</div>}
			{papers.map((paper, i) => {
				return (
					<div key={paper.id} className="py-5">
						<Suspense fallback={<div>loading...</div>}>
							<Paper
								id={paper.id}
								isBookmarked={Boolean(bookmarks[paper.id])}
							/>
						</Suspense>
					</div>
				);
			})}
		</>
	);
}

type PaperProps = Pick<FeedItemProps, "isBookmarked"> & {
	id: string;
};

async function Paper({ id, isBookmarked }: PaperProps) {
	let paper = await Redis.papers.get(id, "arxiv");

	if (paper && !paper.generated) {
		paper = await generate(paper, "arxiv");
	}

	if (!paper) {
		return null;
	}

	const paperWithPosts = await PostService.getSinglePaperIdWithPosts(
		paper.id,
		undefined,
	);

	return (
		<FeedItem
			paper={{
				...paper,
				posts: paperWithPosts?.posts ?? [],
			}}
			provider="arxiv"
			isBookmarked={isBookmarked}
		/>
	);
}
