"use client";

import { ANONYMOUS_USER_ID } from "@/app/constants";
import { BasicReaderUserData } from "@/services/paper-reads-service";
import { PostWithCommentsAndAuthor } from "@/services/post-service";
import { cn } from "@proemial/shadcn-ui";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { AuthorAvatar } from "./author-avatar";
import { useAssistant } from "./proem-assistant/use-assistant";

const MAX_AVATARS = 10;

type Props = {
	posts: PostWithCommentsAndAuthor[];
	readers: BasicReaderUserData[];
	className?: string;
};

export const EngagementIndicator = ({ posts, readers, className }: Props) => {
	const { id: paperId } = useParams<{ id?: string }>();
	const { open } = useAssistant();
	const clickable = paperId && posts.length > 0;

	const readCount = formatReadCount(readers);
	const questions = formatQuestionsAsked(posts.length);

	const userAvatars = useMemo(() => {
		const postAuthors = posts.map((p) => p.author);
		const combinedAvatars = [...readers, ...postAuthors];
		const uniqueUserAvatars = combinedAvatars.filter(
			(avatar, index, avatars) => {
				const duplicateIndex = avatars.findIndex((a) => {
					if (!a.lastName || !avatar.lastName) {
						return false;
					}
					return (
						a.firstName === avatar.firstName &&
						a.lastName === avatar.lastName &&
						a.imageUrl === avatar.imageUrl
					);
				});
				return index === duplicateIndex;
			},
		);
		return uniqueUserAvatars
			.sort((a, b) => a.firstName?.localeCompare(b.firstName ?? "") ?? 0)
			.slice(0, MAX_AVATARS);
	}, [readers, posts]);

	const handleClick = () => {
		if (clickable) {
			open();
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
	return count === 1 ? "1 person read this" : `${count} people read this`;
};
