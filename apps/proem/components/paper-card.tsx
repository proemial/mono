"use client";
import {
	AddToCollectionButton,
	AddToCollectionButtonProps,
} from "@/app/(pages)/(app)/space/(discover)/add-to-collection-button";
import { toTitleCaseIfAllCaps } from "@proemial/utils/string";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
	Icons,
} from "@proemial/shadcn-ui";
import Markdown from "./markdown";

export type PaperCardProps = Partial<
	Pick<
		AddToCollectionButtonProps,
		"paperId" | "fromTrackingKey" | "isBookmarked"
	>
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
	isBookmarked,
	fromTrackingKey,
}: PaperCardProps) {
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
			{paperId && fromTrackingKey ? (
				<div
					className="-ml-2.5 -mb-2.5 self-start"
					onClick={(event) => {
						// Prevent triggering the parent a tag when clicking the button
						event.preventDefault();
					}}
				>
					<AddToCollectionButton
						isBookmarked={isBookmarked}
						paperId={paperId}
						fromTrackingKey={fromTrackingKey}
					/>
				</div>
			) : null}
		</Card>
	);
}
