"use server";
import FeedItem, {
	FeedPaper,
} from "@/app/(pages)/(app)/space/(discover)/feed-item";
import { getFieldFromOpenAlexTopics } from "@/app/(pages)/(app)/space/(discover)/get-field-from-open-alex-topics";
import { fetchPaperWithPostsAndReaders } from "@/app/data/feed";
import { fromIds } from "@/app/data/papers-by-ids";
import React from "react";
import { ThemeColoredCard } from "./theme-colored-card";
import { OpenAlexPaper } from "@proemial/repositories/oa/models/oa-paper";

type Props = {
	ids: string[];
	limit?: number;
};

export async function PaperList({ ids: urls, limit }: Props) {
	const ids = urls.map((url) => url.split("/").at(-1) as string);
	const papers = await fromIds(ids);

	const dedupedPapersWithAbstracts = papers
		.filter(
			(paper, index, self) =>
				index === self.findIndex((p) => p?.data?.title === paper?.data?.title),
		)
		.filter((p) => p?.data?.abstract_inverted_index)
		.slice(0, limit);

	const papersWithPostsAndReaders = await Promise.all(
		dedupedPapersWithAbstracts.map((paper) =>
			fetchPaperWithPostsAndReaders({ paperId: (paper as OpenAlexPaper).id }),
		),
	);
	const feedWithPostsAndReaders = dedupedPapersWithAbstracts.map(
		(row) =>
			({
				...row,
				posts:
					papersWithPostsAndReaders.find((paper) => paper.paperId === row?.id)
						?.posts ?? [],
				readers:
					papersWithPostsAndReaders.find((paper) => paper.paperId === row?.id)
						?.readers ?? [],
			}) as FeedPaper,
	);

	return (
		<>
			{feedWithPostsAndReaders.map((paper, i) => (
				<RelatedPaper key={i} paper={paper} />
			))}
		</>
	);
}

function RelatedPaper({ paper }: { paper: FeedPaper }) {
	const topics = paper.data.topics;
	const field = topics && getFieldFromOpenAlexTopics(topics);

	const item = <FeedItem paper={paper} readonly={true} />;

	if (field) {
		return <ThemeColoredCard theme={field?.theme}>{item}</ThemeColoredCard>;
	}

	return item;
}
