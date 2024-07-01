"use client";
import {
	AddToCollectionButton,
	AddToCollectionButtonProps,
} from "@/app/(pages)/(app)/space/(discover)/add-to-collection-button";
import { Header4 } from "@proemial/shadcn-ui";
import { File02 } from "@untitled-ui/icons-react";

export type PaperReaderHeadlineProps = Pick<
	AddToCollectionButtonProps,
	"bookmarks" | "paperId" | "customCollectionId"
>;
export function PaperReaderHeadline({
	bookmarks,
	paperId,
	customCollectionId,
}: PaperReaderHeadlineProps) {
	return (
		<div className="flex items-center gap-3">
			<File02 className="size-5" />
			<Header4>Research Paper</Header4>
			<div
				className="-m-2.5"
				onClick={(event) => {
					// Prevent triggering the parent a tag when clicking the button
					event.preventDefault();
				}}
			>
				<AddToCollectionButton
					bookmarks={bookmarks}
					paperId={paperId}
					fromTrackingKey="fromRead"
					customCollectionId={customCollectionId}
				/>
			</div>
		</div>
	);
}
