"use client";
import {
	AddToCollectionButton,
	AddToCollectionButtonProps,
} from "@/app/(pages)/(app)/discover/add-to-collection-button";
import { useInternalUser } from "@/app/hooks/use-user";
import { Header4 } from "@proemial/shadcn-ui";
import { File02 } from "@untitled-ui/icons-react";

export type PaperReaderHeadlineProps = Pick<
	AddToCollectionButtonProps,
	"bookmarks" | "paperId"
>;
export function PaperReaderHeadline({
	bookmarks,
	paperId,
}: PaperReaderHeadlineProps) {
	const { isInternal } = useInternalUser();

	return (
		<div className="flex items-center gap-3">
			<File02 className="size-5" />
			<Header4>Research Paper</Header4>
			{isInternal ? (
				<div
					className="-m-2.5"
					onClick={(event) => {
						// Prevent triggering the parent a tag when clicking the button
						event.preventDefault();
					}}
				>
					<AddToCollectionButton bookmarks={bookmarks} paperId={paperId} />
				</div>
			) : null}
		</div>
	);
}
