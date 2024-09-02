"use client";

import { PostWithCommentsAndAuthor } from "@/services/post-service";
import { cn } from "@proemial/shadcn-ui";
import { useParams } from "next/navigation";
import { AuthorAvatar } from "./author-avatar";
import { useAssistant } from "./proem-assistant/use-assistant";

type Props = {
	posts: PostWithCommentsAndAuthor[];
	className?: string;
};

export const EngagementIndicator = ({ posts, className }: Props) => {
	if (posts.length === 0) {
		return undefined;
	}

	const distinctAuthors = posts.reduce(
		(authors: PostWithCommentsAndAuthor["author"][], post) => {
			if (!authors.find((author) => author && author.id === post.author?.id)) {
				authors.push(post.author);
			}
			return authors;
		},
		[],
	);

	const { id: paperId } = useParams<{ id?: string }>();
	const { open } = useAssistant();

	const handleClick = () => {
		if (paperId) {
			open();
		}
	};

	return (
		<div
			className={cn("flex gap-2", className, { "cursor-pointer": !!paperId })}
			onClick={handleClick}
		>
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
			<div className="text-sm opacity-90 items-center flex">
				{formatQuestionsAskedLabel(posts.length)}
			</div>
		</div>
	);
};

const formatQuestionsAskedLabel = (count: number) =>
	count === 1 ? "1 question asked" : `${count} questions asked`;
