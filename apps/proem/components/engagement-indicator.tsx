"use client";

import { PostWithCommentsAndAuthor } from "@/services/post-service";
import { cn } from "@proemial/shadcn-ui";
import { useParams } from "next/navigation";
import { AuthorAvatar } from "./author-avatar";
import { useAssistant } from "./proem-assistant/use-assistant";

type Props = {
	posts: PostWithCommentsAndAuthor[];
	distinctReadCount: number | undefined;
	className?: string;
};

export const EngagementIndicator = ({
	posts,
	distinctReadCount,
	className,
}: Props) => {
	const { id: paperId } = useParams<{ id?: string }>();
	const { open } = useAssistant();
	const clickable = paperId && posts.length > 0;

	const readCount = distinctReadCount
		? `${distinctReadCount} people read this`
		: undefined;
	const questions = formatQuestionsAskedLabel(posts.length);

	const distinctAuthors = posts.reduce(
		(authors: PostWithCommentsAndAuthor["author"][], post) => {
			if (!authors.find((author) => author && author.id === post.author?.id)) {
				authors.push(post.author);
			}
			return authors;
		},
		[],
	);

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
			{distinctAuthors.length > 0 && (
				<div className="flex gap-2">
					{distinctAuthors.map((author, index) => (
						<AuthorAvatar
							key={index}
							firstName={author?.firstName ?? null}
							lastName={author?.lastName ?? null}
							imageUrl={author?.imageUrl}
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

const formatQuestionsAskedLabel = (count: number) => {
	if (count === 0) {
		return;
	}
	return count === 1 ? "1 question" : `${count} questions`;
};
