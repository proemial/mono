import { PaperPost } from "@/services/post-service";
import { Answer } from "@proemial/data/neon/schema";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { AuthorAvatar, getFullName } from "../author-avatar";
import { applyExplainLinks } from "../chat-apply-links";
import { ProemLogo } from "../icons/brand/logo";

dayjs.extend(relativeTime);

export type TuplePost = {
	id: string;
	content: PaperPost["content"];
	author: {
		id: string;
		firstName: string | null;
		lastName: string | null;
		imageUrl: string | undefined;
	};
	createdAt: Date;
	reply:
		| {
				content: PaperPost["comments"][number]["content"];
				answerMetadata?: {
					slug: Answer["slug"];
					shareId: Answer["shareId"];
					ownerId: Answer["ownerId"];
					followUpQuestions: Answer["followUpQuestions"];
					papers: Answer["papers"];
				};
		  }
		| undefined;
};

type Props = {
	post: TuplePost;
	onSubmit: (input: string) => void;
};

export const Tuple = ({ post, onSubmit }: Props) => {
	const { author } = post;
	const formattedPostDate = dayjs(post.createdAt).fromNow();

	return (
		<div className="flex flex-col rounded-lg gap-2 p-2 pr-3 bg-theme-700">
			<div className="flex gap-2">
				<AuthorAvatar
					imageUrl={author.imageUrl}
					firstName={author.firstName}
					lastName={author.lastName}
				/>
				<div className="text-white">
					<div className="flex gap-2">
						<div className="font-bold">
							{getFullName(author.firstName, author.lastName)}
						</div>
						<div className="opacity-30">{formattedPostDate}</div>
					</div>
					<div className="opacity-50 italic">{post.content}</div>
				</div>
			</div>
			{post.reply && (
				<div className="flex gap-2">
					<div>
						<ProemLogo
							size="xs"
							className="size-6 py-1.5 rounded-full bg-white"
						/>
					</div>
					<div className="flex flex-col gap-1">
						<div className="text-white">
							{applyExplainLinks(
								post.reply.content,
								(input: string) => onSubmit(`What is ${input}?`),
								"bg-transparent opacity-50 font-semibold cursor-default",
							)}
						</div>
						{post.reply.answerMetadata?.papers && (
							<div className="text-right text-white text-opacity-50 text-xs">
								Based on {post.reply.answerMetadata.papers.papers.length}{" "}
								research papers.
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};
