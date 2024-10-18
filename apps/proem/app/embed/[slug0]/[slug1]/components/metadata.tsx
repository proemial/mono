"use client";

import { EmbedableLink } from "./link";
import { AlertTriangle } from "@untitled-ui/icons-react";
import { ReactNode } from "react";
import { FeedItemField } from "@/app/(pages)/(app)/space/(discover)/feed-item-field";
import { formatDate } from "@/utils/date";
import { FeedPaper } from "./card";

export type FeedItemCardProps = {
	paper: FeedPaper;
	children: ReactNode;
	customCollectionId: string;
};

export const PaperMetadata = ({
	paper,
	children,
	customCollectionId,
}: FeedItemCardProps) => {
	const date =
		paper.data.created_date || (paper.data.publication_date as string);

	return (
		<div className="flex flex-col gap-3">
			<EmbedableLink path={paper.path} spaceId={customCollectionId}>
				{paper.data.abstract ? (
					<div>
						<div className="flex items-center justify-between gap-2 mb-1">
							<FeedItemField topics={paper.data.topics} />
							<div className="flex items-center gap-2 ">
								<div className="uppercase text-2xs text-nowrap">
									{formatDate(date, "relative")}
								</div>
							</div>
						</div>
						{children}
					</div>
				) : (
					<>
						<div className="flex items-center gap-2 font-bold">
							<AlertTriangle className="size-4 opacity-85" />
							This paper is not publicly available.
						</div>
						<div className="text-muted-foreground">{children}</div>
					</>
				)}
			</EmbedableLink>
		</div>
	);
};
