"use client";
import { togglePaperInCollection } from "@/app/(pages)/(app)/space/(discover)/bookmark-paper";
import FeedItem, {
	FeedItemProps,
} from "@/app/(pages)/(app)/space/(discover)/feed-item";
import { Button, cn } from "@proemial/shadcn-ui";
import { useState } from "react";

type FeedItemWithDisabledOverlayProps = FeedItemProps;

export function FeedItemWithDisabledOverlay({
	paper,
	isBookmarked,
	customCollectionId,
}: FeedItemWithDisabledOverlayProps) {
	const [isDisabled, setIsDisabled] = useState(false);
	const onBookmarkToggleClick = (isDisabled: boolean) =>
		setIsDisabled(isDisabled);

	return (
		<div className="relative">
			{isDisabled && (
				<div className="absolute top-0 left-0 z-10 flex items-center justify-center w-full h-full">
					{customCollectionId && (
						<div className="bg-background shadow rounded-xl flex justify-between gap-5 items-center py-0.5 pl-2.5">
							<span className="text-sm">This paper has been removed</span>

							<Button
								variant="ghost"
								className="p-2.5 text-sm underline"
								onClick={async () => {
									onBookmarkToggleClick(false);
									await togglePaperInCollection({
										paperId: paper.id,
										collectionId: customCollectionId,
										isEnabled: true,
										revalidateCache: false,
									});
								}}
							>
								Undo
							</Button>
						</div>
					)}
				</div>
			)}
			<div
				className={cn({
					"opacity-20 pointer-events-auto blur-sm": isDisabled,
				})}
			>
				<FeedItem
					paper={paper}
					isBookmarked={isBookmarked}
					customCollectionId={customCollectionId}
					onBookmarkToggleClick={onBookmarkToggleClick}
				/>
			</div>
		</div>
	);
}
