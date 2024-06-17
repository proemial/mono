"use client";

import {
	AddToCollectionButton,
	AddToCollectionButtonProps,
} from "@/app/(pages)/(app)/discover/add-to-collection-button";
import { Field } from "@/app/data/oa-fields";
import { useInternalUser } from "@/app/hooks/use-user";
import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import { SignInDrawer } from "@/components/sign-in-drawer";
import { useUser } from "@clerk/nextjs";
import { Prefix } from "@proemial/redis/adapters/papers";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

dayjs.extend(relativeTime);

export type FeedItemCardProps = Pick<
	AddToCollectionButtonProps,
	"bookmarks" | "customCollectionId"
> & {
	id: string;
	date: string;
	field: Field | undefined;
	children: ReactNode;
	provider?: Prefix;
};

export const FeedItemCard = ({
	id,
	date,
	field,
	children,
	provider,
	bookmarks,
	customCollectionId,
}: FeedItemCardProps) => {
	const { isSignedIn } = useUser();
	const { isInternal } = useInternalUser();

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center justify-between gap-2">
				{field ? (
					<div className="flex items-center gap-2">
						{field.icon}
						<div className="text-xs uppercase line-clamp-1">
							{field.displayName}
						</div>
					</div>
				) : (
					<div />
				)}
				<div className="flex items-center">
					<div className="uppercase text-2xs text-nowrap">
						{dayjs(date).fromNow()}
					</div>
					{isInternal ? (
						<>
							{isSignedIn ? (
								<AddToCollectionButton
									bookmarks={bookmarks}
									paperId={id}
									customCollectionId={customCollectionId}
								/>
							) : (
								<SignInDrawer trigger={<PlusCircle className="size-4" />} />
							)}
						</>
					) : null}
				</div>
			</div>
			<Link
				href={`/paper/${provider ?? "oa"}/${id}`}
				onClick={trackHandler(analyticsKeys.feed.click.card)}
			>
				{children}
			</Link>
		</div>
	);
};
