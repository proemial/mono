"use client";
import Markdown from "@/components/markdown";
import { trimForQuotes } from "@/utils/string-utils";
import { RankedPaperFeature } from "@proemial/repositories/oa/fingerprinting/rerank";
import { OpenAlexPaper } from "@proemial/repositories/oa/models/oa-paper";
import { oaTopicsTranslationMap } from "@proemial/repositories/oa/taxonomy/oa-topics-compact";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ReactNode } from "react";
import { PaperMetadata, FeedItemCardProps } from "./metadata";
import { PaperTags } from "./tags";
import { PaperActivity } from "./activity";

dayjs.extend(relativeTime);

export type FeedPaper = OpenAlexPaper & {
	path: string;
};

export type FeedItemProps = Pick<FeedItemCardProps, "customCollectionId"> & {
	paper: FeedPaper;
	fingerprint?: RankedPaperFeature[];
	children?: ReactNode;
};

export default function PaperCard({
	paper,
	fingerprint,
	children,
	customCollectionId,
}: FeedItemProps) {
	const tags = paper.data.topics
		?.map((topic) => oaTopicsTranslationMap[topic.id]?.["short-name"])
		.filter(Boolean) as string[];

	return (
		<div className="h-full flex flex-col gap-2 justify-between">
			<PaperMetadata paper={paper} customCollectionId={customCollectionId}>
				<Markdown>
					{paper.generated?.title
						? trimForQuotes(paper.generated.title)
						: paper.data.title}
				</Markdown>
			</PaperMetadata>

			{children}

			<div>
				<div
					className="flex gap-2 scrollbar-hide overflow-x-auto w-[calc(100%+12px)] -mx-[12px] pl-[12px]"
					style={{
						maskImage:
							"linear-gradient(to right, transparent 0px, black 12px, black calc(100% - 12px), transparent 100%)",
					}}
				>
					<PaperTags
						features={fingerprint}
						paper={paper}
						tags={tags}
						spaceId={customCollectionId}
					/>
				</div>

				<div className="min-h-6">
					<PaperActivity
						paper={paper}
						customCollectionId={customCollectionId}
					/>
				</div>
			</div>
		</div>
	);
}
