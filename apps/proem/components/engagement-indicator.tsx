"use client";

import { ANONYMOUS_USER_ID } from "@/app/constants";
import { BasicReaderUserData } from "@/services/paper-reads-service";
import { PostWithCommentsAndAuthor } from "@/services/post-service";
import { cn } from "@proemial/shadcn-ui";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { AuthorAvatar } from "./author-avatar";
import { useAssistant } from "./proem-assistant/use-assistant/use-assistant";

const MAX_ANONYMOUS_AVATARS = 10;

type Props = {
	posts: PostWithCommentsAndAuthor[];
	readers: BasicReaderUserData[];
	maxAvatars?: number;
	className?: string;
};

export const EngagementIndicator = ({
	posts,
	readers,
	maxAvatars = 10,
	className,
}: Props) => {
	const { id: paperId } = useParams<{ id?: string }>();
	const { openAssistant } = useAssistant();
	const clickable = paperId && posts.length > 0;

	const readCount = formatReadCount(readers);
	const questions = formatQuestionsAsked(posts.length);

	const userAvatars = useMemo(
		() => getUserAvatars(posts, readers, maxAvatars),
		[readers, posts, maxAvatars],
	);

	const handleClick = () => {
		if (clickable) {
			openAssistant();
		}
	};

	return (
		<div
			className={cn("flex gap-2", className, { "cursor-pointer": clickable })}
			onClick={handleClick}
		>
			{userAvatars.length > 0 && (
				<div className="flex gap-2">
					{userAvatars.map((reader, index) => (
						<AuthorAvatar
							key={index}
							firstName={reader.firstName ?? null}
							lastName={reader.lastName ?? null}
							imageUrl={reader.imageUrl}
						/>
					))}
				</div>
			)}
			<div className="text-sm opacity-90 items-center flex gap-1.5">
				{readCount && <span>{readCount}</span>}
				{readCount && questions && <span>·</span>}
				{questions && <span>{questions}</span>}
			</div>
		</div>
	);
};

const formatQuestionsAsked = (count: number) => {
	if (count === 0) {
		return;
	}
	return count === 1 ? "1 question" : `${count} questions`;
};

const formatReadCount = (readers: BasicReaderUserData[]) => {
	// For anonymous readers, we use the read count (so 1 anonymous read = 1 unique reader)
	const anonymousReads =
		readers.find((r) => r.id === ANONYMOUS_USER_ID)?.readCount ?? 0;
	const count =
		anonymousReads > 0 ? anonymousReads - 1 + readers.length : readers.length;
	if (count === 0) {
		return;
	}
	return count === 1 ? "1 view" : `${count} views`;
};

const getUserAvatars = (
	posts: PostWithCommentsAndAuthor[],
	readers: BasicReaderUserData[],
	maxAvatars: number,
) => {
	const nonAnonPostAuthors = posts
		.filter((p) => p.authorId !== ANONYMOUS_USER_ID)
		.map((p) => p.author);
	const nonAnonReaders = readers.filter((r) => r.id !== ANONYMOUS_USER_ID);
	const noOfAnonPostAuthors = posts.filter(
		(p) => p.authorId === ANONYMOUS_USER_ID,
	).length;
	const noOfAnonReads =
		readers.find((r) => r.id === ANONYMOUS_USER_ID)?.readCount ?? 0;

	const uniqueRealUsers = [...nonAnonPostAuthors, ...nonAnonReaders]
		.filter((user, index, users) => {
			const duplicateIndex = users.findIndex((a) => a.id === user.id);
			return index === duplicateIndex;
		})
		.sort((a, b) => a.firstName?.localeCompare(b.firstName ?? "") ?? 0);

	const minArrayLength =
		MAX_ANONYMOUS_AVATARS - uniqueRealUsers.length < 0
			? 0
			: MAX_ANONYMOUS_AVATARS - uniqueRealUsers.length;
	const distinctAnonymousUsers = Array(
		Math.min(minArrayLength, noOfAnonPostAuthors + noOfAnonReads),
	)
		.fill(null)
		.map(() => ({
			id: ANONYMOUS_USER_ID,
			firstName: "Anonymous",
			lastName: null,
			imageUrl: undefined,
		}));

	const combined = [...distinctAnonymousUsers, ...uniqueRealUsers];
	return combined.slice(combined.length - maxAvatars, combined.length);
};
