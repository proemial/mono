"use client";

import { useThrobberStatus } from "@/app/(pages)/(app)/ask/answer/[slug]/use-throbber-status";
import { routes } from "@/routes";
import { Comment, Post } from "@proemial/data/neon/schema";
import { CardBullet, cn } from "@proemial/shadcn-ui";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ReactNode, useEffect, useRef } from "react";
import { AuthorAvatar, getFullName } from "../author-avatar";
import { applyExplainLinks } from "../chat-apply-links";
import { ProemLogo } from "../icons/brand/logo";
import {
	ASSISTANT_OPEN_QUERY_KEY,
	ASSISTANT_SELECTED_QUERY_KEY,
	useAssistant,
} from "./use-assistant/use-assistant";

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
				"flex flex-col rounded-2xl gap-2 p-2 pr-3 bg-theme-700 border-2 duration-100",
				{
					"cursor-pointer": hasPaperSources && !highlight,
					"border-theme-200": highlight,
					"border-transparent": !highlight,
					"min-h-[200px]": streaming,
				},
			)}
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
					<SelectableContent>{post.content}</SelectableContent>
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
	);
};

const SelectableContent = ({ children }: { children: ReactNode }) => (
	<div data-vaul-no-drag className="select-text">
		{children}
	</div>
);
