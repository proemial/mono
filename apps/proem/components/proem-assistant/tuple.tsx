import { useThrobberStatus } from "@/app/(pages)/(app)/ask/answer/[slug]/use-throbber-status";
import { routes } from "@/routes";
import { Comment, Post } from "@proemial/data/neon/schema";
import { CardBullet, cn } from "@proemial/shadcn-ui";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";
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
	highlight?: boolean;
	streaming?: boolean;
	onAbort?: () => void;
};

export const Tuple = ({
	post,
	onSubmit,
	highlight,
	streaming,
	onAbort,
}: Props) => {
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
	const hasPaperSources = post.slug && post.reply?.metadata?.papers;
	const { open, slug } = useAssistant();
	const ref = useRef<HTMLDivElement>(null);

	const handleClick = () => {
		if (hasPaperSources && !slug) {
			// biome-ignore lint/style/noNonNullAssertion: `hasPaperSources` true entails `post.slug` is defined
			open(post.slug!);
		}
	};

	useEffect(() => {
		if (ref.current && highlight) {
			ref.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [highlight]);

	return (
		<div
			className={cn("flex flex-col rounded-2xl gap-2 p-2 pr-3 bg-theme-700", {
				"cursor-pointer hover:bg-theme-800 duration-200":
					!!post.reply?.metadata?.papers && !slug,
				"border-2 border-theme-200": highlight,
			})}
			onClick={handleClick}
			ref={ref}
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
										onClick={(e) => {
											e.stopPropagation();
										}}
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
			{/* {highlight && streaming && (
				<button
					type="button"
					onClick={onAbort}
					className="mt-2.5 mb-1 rounded-full bg-theme-400 hover:bg-theme-500 active:bg-theme-600 text-white px-3 py-1.5 duration-200"
				>
					Stop
				</button>
			)} */}
		</div>
	);
};
