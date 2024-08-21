import { useThrobberStatus } from "@/app/(pages)/(app)/ask/answer/[slug]/use-throbber-status";
import { routes } from "@/routes";
import { Comment, Post } from "@proemial/data/neon/schema";
import { CardBullet } from "@proemial/shadcn-ui";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AuthorAvatar, getFullName } from "../author-avatar";
import { applyExplainLinks } from "../chat-apply-links";
import { ProemLogo } from "../icons/brand/logo";

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
	const { collectionId: spaceId } = useParams<{ collectionId?: string }>();
	const papers =
		(post.reply?.metadata?.papers as {
			title: string;
			abstract: string;
			link: string;
		}[]) ?? [];

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
			<div className="flex gap-2">
				<div>
					<ProemLogo
						size="xs"
						className="size-6 py-1.5 rounded-full bg-white"
					/>
				</div>
				{post.reply ? (
					<div className="flex flex-col gap-1 text-white">
						<div>
							{applyExplainLinks(
								post.reply.content,
								(input: string) => onSubmit(`What is ${input}?`),
								"bg-transparent opacity-50 font-semibold cursor-default",
							)}
							{papers.length > 0 &&
								papers.map((paper, index) => (
									<Link
										key={index}
										href={
											spaceId
												? `${routes.space}/${spaceId}/paper${paper.link}`
												: `/paper${paper.link}`
										}
									>
										<CardBullet
											variant="numbered"
											className="inline-block ml-1 border-white pt-0"
										>
											{index + 1}
										</CardBullet>
									</Link>
								))}
						</div>
					</div>
				) : (
					<div className="text-white text-sm">{throbberStatus}</div>
				)}
			</div>
		</div>
	);
};
