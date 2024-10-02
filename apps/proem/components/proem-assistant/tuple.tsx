"use client";

import { useThrobberStatus } from "@/app/(pages)/(app)/ask/answer/[slug]/use-throbber-status";
import { routes } from "@/routes";
import { Comment, Post } from "@proemial/data/neon/schema";
import { CardBullet, cn } from "@proemial/shadcn-ui";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useParams, useRouter } from "next/navigation";
import { ReactNode, useRef } from "react";
import { AuthorAvatar, getFullName } from "../author-avatar";
import { applyExplainLinks } from "../chat-apply-links";
import { ProemLogo } from "../icons/brand/logo";
import { useAssistant } from "./use-assistant/use-assistant";
import { motion, AnimatePresence } from "framer-motion";

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
	onSubmit?: (input: string) => void;
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
	const { collectionId: spaceId } = useParams<{ collectionId?: string }>();
	const { author } = post;
	const formattedPostDate = dayjs(post.createdAt).fromNow();
	const throbberStatus = useThrobberStatus();
	const papers =
		(post.reply?.metadata?.papers as {
			title: string;
			abstract: string;
			link: string;
		}[]) ?? [];
	const hasPaperSources = post.slug && post.reply?.metadata?.papers;
	const ref = useRef<HTMLDivElement>(null);

	const handleSubmit = (input: string) => {
		onSubmit?.(`What is ${input}?`);
		ref.current?.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<div
			className={cn(
				"flex flex-col rounded-[16px] bg-theme-700 border-2 duration-100",
				{
					"cursor-pointer": hasPaperSources && !highlight,
					"border-theme-200": highlight,
					"border-transparent": !highlight,
					"min-h-[200px]": streaming,
				},
			)}
			ref={ref}
		>
			<div className="flex flex-col gap-2 pb-4">
				<div className="flex gap-2 pl-2 pr-3 pt-2">
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
						<SelectableContent>{post.content}</SelectableContent>
					</div>
				</div>
				<div className="flex gap-2 pl-2 pr-3">
					<div>
						<ProemLogo
							size="xs"
							className="size-6 py-1.5 rounded-full bg-white"
						/>
					</div>
					{post.reply ? (
						<div className="flex flex-col gap-1 text-white">
							<SelectableContent>
								{applyExplainLinks(
									post.reply.content,
									handleSubmit,
									"bg-transparent font-semibold text-theme-300 cursor-default",
								)}
								{papers.length > 0 &&
									papers.map((paper, index) => (
										<CardBullet
											key={index}
											variant="numbered"
											className="inline-block ml-1 border-white pt-0 select-none"
										>
											{index + 1}
										</CardBullet>
									))}
							</SelectableContent>
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

			<AnimatePresence>
				{papers.length > 0 && highlight && (
					<motion.div
						className={cn(
							"flex flex-col gap-0.5 pt-3 pb-2 bg-theme-600 rounded-b-[14px]",
						)}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.15 }}
					>
						{papers.map((paper, index) => (
							<PaperReference
								key={index}
								title={paper.title}
								link={paper.link}
								index={index + 1}
								spaceId={spaceId}
							/>
						))}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

const SelectableContent = ({ children }: { children: ReactNode }) => (
	<div data-vaul-no-drag className="select-text">
		{children}
	</div>
);

const PaperReference = ({
	title,
	link,
	index,
	spaceId,
}: {
	title: string;
	link: string;
	index: number;
	spaceId: string | undefined;
}) => {
	const router = useRouter();
	const { closeAssistant } = useAssistant();

	const handleClick = () => {
		const url = spaceId
			? `${routes.space}/${spaceId}${routes.paper}${link}`
			: `${routes.paper}${link}`;

		closeAssistant().then(() => {
			setTimeout(() => {
				router.push(url);
			}, 500);
		});
	};

	return (
		<div
			className="flex gap-2.5 items-center text-white hover:bg-theme-500 hover:rounded-md py-1 mx-0.5 pl-2 pr-3 cursor-pointer"
			onClick={handleClick}
		>
			<div className="flex">
				<CardBullet variant="numbered" className="border-white w-5 h-5">
					{index}
				</CardBullet>
			</div>
			<div className="line-clamp-1">{title}</div>
		</div>
	);
};
