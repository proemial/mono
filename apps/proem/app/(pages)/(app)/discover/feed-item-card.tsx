"use client";

import { Field } from "@/app/data/oa-fields";
import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import { SignInDrawer } from "@/components/sign-in-drawer";
import { useUser } from "@clerk/nextjs";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
	addPaperBookmark,
	hasPaperBookmark,
	removePaperBookmark,
} from "./bookmark-paper";
import { Prefix } from "@proemial/redis/adapters/papers";

dayjs.extend(relativeTime);

type Props = {
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
}: Props) => {
	const { user, isSignedIn } = useUser();
	const queryId = `bookmark-${id}`;
	const queryClient = useQueryClient();
	const { data } = useQuery(queryId, async () =>
		hasPaperBookmark({ userId: user?.id, paperId: id }),
	);
	// TODO: Optimistic updates
	const { mutate: addBookmark } = useMutation(addPaperBookmark, {
		onSuccess: () => queryClient.invalidateQueries(queryId),
	});
	const { mutate: removeBookmark } = useMutation(removePaperBookmark, {
		onSuccess: () => queryClient.invalidateQueries(queryId),
	});

	const handleBookmarkPaperAdd = async () => {
		addBookmark({ userId: user?.id, paperId: id });
	};

	const handleBookmarkPaperRemove = async () => {
		removeBookmark({ userId: user?.id, paperId: id });
	};

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
				<div className="flex gap-3 items-center">
					<div className="uppercase text-2xs">{dayjs(date).fromNow()}</div>
					{data ? (
						<BookmarkedIcon
							onClick={handleBookmarkPaperRemove}
							className="cursor-pointer"
						/>
					) : isSignedIn ? (
						<BookmarkIcon
							onClick={handleBookmarkPaperAdd}
							className="cursor-pointer"
						/>
					) : (
						<SignInDrawer
							trigger={<BookmarkIcon className="cursor-pointer" />}
						/>
					)}
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

type IconProps = React.HTMLAttributes<SVGElement>;

const BookmarkedIcon = (props: IconProps) => {
	return (
		<svg
			width="18"
			height="18"
			viewBox="0 0 18 18"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M3.75 5.85C3.75 4.58988 3.75 3.95982 3.99524 3.47852C4.21095 3.05516 4.55516 2.71095 4.97852 2.49524C5.45982 2.25 6.08988 2.25 7.35 2.25H10.65C11.9101 2.25 12.5401 2.25 13.0215 2.49524C13.4449 2.71095 13.7891 3.05516 14.0048 3.47852C14.25 3.95982 14.25 4.58988 14.25 5.85V15.75L9 12.75L3.75 15.75V5.85Z"
				fill="currentColor"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

const BookmarkIcon = (props: IconProps) => {
	return (
		<svg
			width="18"
			height="18"
			viewBox="0 0 18 18"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M3.75 5.85C3.75 4.58988 3.75 3.95982 3.99524 3.47852C4.21095 3.05516 4.55516 2.71095 4.97852 2.49524C5.45982 2.25 6.08988 2.25 7.35 2.25H10.65C11.9101 2.25 12.5401 2.25 13.0215 2.49524C13.4449 2.71095 13.7891 3.05516 14.0048 3.47852C14.25 3.95982 14.25 4.58988 14.25 5.85V15.75L9 12.75L3.75 15.75V5.85Z"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};
