"use client";
import {
	AddToCollectionButton,
	AddToCollectionButtonProps,
} from "@/app/(pages)/(app)/discover/add-to-collection-button";
import Markdown from "@/app/(pages)/(app)/paper/oa/[id]/markdown";
import { useInternalUser } from "@/app/hooks/use-user";
import { SignInDrawer } from "@/components/sign-in-drawer";
import { toTitleCaseIfAllCaps } from "@/utils/string-utils";
import { useUser } from "@clerk/nextjs";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
	Icons,
} from "@proemial/shadcn-ui";
import { PlusCircle } from "lucide-react";

export type PaperCardProps = Pick<
	AddToCollectionButtonProps,
	"paperId" | "bookmarks"
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
}: PaperCardProps) {
	const { isSignedIn } = useUser();
	const { isInternal } = useInternalUser();
	console.log(bookmarks);
	console.log(paperId);

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
			{isInternal ? (
				<div
					className="-ml-2.5 -mb-2.5 self-start"
					onClick={(event) => {
						// Prevent triggering the parent a tag when clicking the button
						event.preventDefault();
					}}
				>
					<>
						{isSignedIn ? (
							<AddToCollectionButton bookmarks={bookmarks} paperId={paperId} />
						) : (
							<SignInDrawer trigger={<PlusCircle className="size-4" />} />
						)}
					</>
				</div>
			) : null}
		</Card>
	);
}
