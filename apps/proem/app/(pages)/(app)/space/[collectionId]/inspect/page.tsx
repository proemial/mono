import { fetchPaper } from "@/app/(pages)/(app)/paper/oa/[id]/fetch-paper";
import { generate } from "@/app/(pages)/(app)/paper/oa/[id]/llm-generate";
import { fetchPaperWithPosts } from "@/app/data/fetch-feed";
import { routes } from "@/routes";
import { getPostBySlug } from "@proemial/data/repository/post";
import { Header4 } from "@proemial/shadcn-ui";
import { redirect } from "next/navigation";
import { FeedItemWithDisabledOverlay } from "../(lists)/saved/feed-item-with-disabled-overlay";
import { DisableOverlayBackground } from "./disable-overlay-background";

type Props = {
	params: {
		collectionId: string;
	};
	searchParams: {
		assistant?: string;
		tuple?: string;
	};
};

const InspectPage = async ({
	params: { collectionId },
	searchParams: { assistant, tuple },
}: Props) => {
	if (!tuple) {
		if (assistant === "true") {
			redirect(`${routes.space}/${collectionId}?assistant=true`);
		} else {
			redirect(`${routes.space}/${collectionId}`);
		}
	}
	const post = await getPostBySlug(tuple);
	const shallowPapers = (post?.comments[0]?.papers as { link: string }[]) ?? [];
	const paperIds = shallowPapers
		.map((paper) => paper.link.split("/").pop())
		.filter((id) => typeof id !== "undefined");
	const papers = await Promise.all(
		paperIds.map((id) => fetchAndGeneratePaper(id)),
	);
	const papersWithPosts = await Promise.all(
		paperIds.map((paperId) => fetchPaperWithPosts(paperId, collectionId)),
	);

	return (
		<div className="flex flex-col gap-3 mb-28">
			<DisableOverlayBackground />
			<Header4>Research references</Header4>
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
							customCollectionId={collectionId}
							isBookmarked={false}
							readonly={true}
							index={index + 1}
						/>
					))}
			</div>
		</div>
	);
};

export default InspectPage;

const fetchAndGeneratePaper = async (paperId: string) => {
	const paper = await fetchPaper(paperId);
	return paper ? await generate(paper) : undefined;
};
