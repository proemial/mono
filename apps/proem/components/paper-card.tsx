"use client";
import {
	AddToCollectionButton,
	AddToCollectionButtonProps,
} from "@/app/(pages)/(app)/discover/add-to-collection-button";
import Markdown from "@/app/(pages)/(app)/paper/oa/[id]/markdown";
import { useInternalUser } from "@/app/hooks/use-user";
import { toTitleCaseIfAllCaps } from "@/utils/string-utils";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
	Icons,
} from "@proemial/shadcn-ui";

export type PaperCardProps = Partial<
	Pick<AddToCollectionButtonProps, "paperId" | "bookmarks" | "fromTrackingKey">
> & {
	date?: string;
	header: React.ReactNode;
	loading?: boolean;
	publisher?: string;
	title: string;
};

export function PaperCard({
	date,
	title,
	publisher,
	header,
	loading,
	paperId,
	bookmarks,
	fromTrackingKey,
}: PaperCardProps) {
	const { isInternal } = useInternalUser();

	return (
		<Card variant="paper" className="flex flex-col justify-between">
			<div>
				<CardHeader>
					{header}
					<CardDescription variant="paperDate">
						{date?.replaceAll("-", ".")}
					</CardDescription>
				</CardHeader>

				{loading ? (
					<div className="flex items-center justify-center mx-auto size-24">
						<Icons.loader />
					</div>
				) : (
					<CardTitle variant="paper" className="line-clamp-4 mb-3.5 mt-4">
						<Markdown>{toTitleCaseIfAllCaps(title)}</Markdown>
					</CardTitle>
				)}

				{publisher && (
					<CardDescription variant="paperPublisher" className="line-clamp-2">
						{publisher}
					</CardDescription>
				)}
			</div>
			{/* TODO: Remove feature toggle */}
			{isInternal && bookmarks && paperId && fromTrackingKey ? (
				<div
					className="-ml-2.5 -mb-2.5 self-start"
					onClick={(event) => {
						// Prevent triggering the parent a tag when clicking the button
						event.preventDefault();
					}}
				>
					<AddToCollectionButton
						bookmarks={bookmarks}
						paperId={paperId}
						fromTrackingKey={fromTrackingKey}
					/>
				</div>
			) : null}
		</Card>
	);
}
