import { useThrobberStatus } from "@/app/(pages)/(app)/ask/answer/[slug]/use-throbber-status";
import { Comment, Post } from "@proemial/data/neon/schema";
import { cn } from "@proemial/shadcn-ui";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { AuthorAvatar, getFullName } from "../author-avatar";
import { applyExplainLinks } from "../chat-apply-links";
import { ProemLogo } from "../icons/brand/logo";
import { useAssistant } from "./use-assistant";

dayjs.extend(relativeTime);

export type TuplePost = {
	id: string;
	createdAt: Date;
	content: string;
	author: {
		id: string;
		firstName: string | null;
		lastName: string | null;
		imageUrl: string | undefined;
	};
	slug: Post["slug"];
	reply:
		| {
				content: string;
				metadata?: {
					// Note: For now, we don't need full author details, as author will always be the assistant
					authorId: Comment["authorId"];
					followUps: Comment["followUps"];
					papers: Comment["papers"];
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
	const throbberStatus = useThrobberStatus();
	const hasPaperSources = post.slug && post.reply?.metadata?.papers;
	const { open } = useAssistant();

	const handleClick = () => {
		if (hasPaperSources) {
			// biome-ignore lint/style/noNonNullAssertion: `hasPaperSources` true entails `post.slug` is defined
			open(post.slug!);
		}
	};

	return (
		<div
			className={cn("flex flex-col rounded-lg gap-2 p-2 pr-3 bg-theme-700", {
				"cursor-pointer hover:bg-theme-800 duration-300": hasPaperSources,
			})}
			onClick={handleClick}
		>
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
			<div className="flex gap-2">
				<div>
					<ProemLogo
						size="xs"
						className="size-6 py-1.5 rounded-full bg-white"
					/>
				</div>
				{post.reply ? (
					<div className="flex flex-col gap-1">
						<div className="text-white">
							{applyExplainLinks(
								post.reply.content,
								(input: string) => onSubmit(`What is ${input}?`),
								"bg-transparent opacity-50 font-semibold cursor-default",
							)}
						</div>
						{post.reply.metadata?.papers && (
							<div className="text-right text-white text-opacity-50 text-xs">
								Based on {post.reply.metadata.papers.length} research papers.
							</div>
						)}
					</div>
				) : (
					<div className="text-white text-sm">{throbberStatus}</div>
				)}
			</div>
		</div>
	);
};
