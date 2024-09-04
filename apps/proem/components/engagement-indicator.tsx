"use client";

import { BasicReaderUserData } from "@/services/paper-reads-service";
import { PostWithCommentsAndAuthor } from "@/services/post-service";
import { cn } from "@proemial/shadcn-ui";
import { useParams } from "next/navigation";
import { AuthorAvatar } from "./author-avatar";
import { useAssistant } from "./proem-assistant/use-assistant";

type Props = {
	posts: PostWithCommentsAndAuthor[];
	readers: BasicReaderUserData[];
	className?: string;
};

export const EngagementIndicator = ({ posts, readers, className }: Props) => {
	const { id: paperId } = useParams<{ id?: string }>();
	const { open } = useAssistant();
	const clickable = paperId && posts.length > 0;

	const readCount =
		readers.length > 0 ? `${readers.length} people read this` : undefined;
	const questions = formatQuestionsAskedLabel(posts.length);

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
			{readers.length > 0 && (
				<div className="flex gap-2">
					{readers.map((reader, index) => (
						<AuthorAvatar
							key={index}
							firstName={reader.firstName}
							lastName={reader.lastName}
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

const formatQuestionsAskedLabel = (count: number) => {
	if (count === 0) {
		return;
	}
	return count === 1 ? "1 question" : `${count} questions`;
};
