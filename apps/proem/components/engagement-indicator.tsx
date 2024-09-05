"use client";

import { BasicReaderUserData } from "@/services/paper-reads-service";
import { PostWithCommentsAndAuthor } from "@/services/post-service";
import { cn } from "@proemial/shadcn-ui";
import { useParams } from "next/navigation";
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

	const readCount = formatReadCount(readers.length);
	const questions = formatQuestionsAsked(posts.length);

	// Remove post author duplicates
	const postAuthors = posts.reduce(
		(authors: PostWithCommentsAndAuthor["author"][], post) => {
			if (!authors.find((author) => author && author.id === post.author?.id)) {
				authors.push(post.author);
			}
			return authors;
		},
		[],
	);

	const userAvatars = readers.length > 0 ? readers : postAuthors;
	const first10UserAvatars = userAvatars.slice(0, MAX_AVATARS);

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
			{first10UserAvatars.length > 0 && (
				<div className="flex gap-2">
					{first10UserAvatars.map((reader, index) => (
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

const formatReadCount = (count: number) => {
	if (count === 0) {
		return;
	}
	return count === 1 ? "1 person read this" : `${count} people read this`;
};
