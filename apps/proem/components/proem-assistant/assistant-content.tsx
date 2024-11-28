import { AssistantData } from "@/app/api/assistant/route";
import {
	AnswerEngineEvents,
	findLatestByEventType,
} from "@/app/api/bot/answer-engine/events";
import { ANONYMOUS_USER_ID, PAPER_BOT_USER_ID } from "@/app/constants";
import { PostWithCommentsAndAuthor } from "@/services/post-service";
import { useUser } from "@clerk/nextjs";
import { Comment, Post } from "@proemial/data/neon/schema";
import { Button, DrawerClose, DrawerContent } from "@proemial/shadcn-ui";
import {
	Dialog,
	DialogDescription,
	DialogTitle,
} from "@proemial/shadcn-ui/components/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";
import { X } from "@untitled-ui/icons-react";
import { generateId } from "ai";
import { Message, useChat } from "ai/react";
import { motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import useMeasure from "react-use-measure";
import {
	analyticsKeys,
	trackHandler,
} from "../analytics/tracking/tracking-keys";
import { AskScienceForm } from "./ask-science-form";
import { PROEM_ASSISTANT_QUERY_KEY } from "./assistant";
import { Header } from "./assistant-header";
import { InspectAnswer } from "./inspect-answer";
import { PreviousQuestions } from "./previous-questions";
import { SuggestedQuestions } from "./suggested-questions";
import { TuplePost } from "./tuple";
import { useAssistant } from "./use-assistant/use-assistant";
import { useLatestSubmitId } from "./use-latest-submit-id";

type User = ReturnType<typeof useUser>["user"];

export type MessageWithMetadata = Message & {
	createdAt: Date;
	metadata?: {
		slug?: Post["slug"];
		followUps?: Comment["followUps"];
		papers?: Comment["papers"];
		author?: {
			id: string;
			firstName: string | undefined;
			lastName: string | undefined;
			imageUrl: string | undefined;
		};
		shared?: Post["shared"];
	};
};

type Props = {
	spaceId: string | undefined;
	paperId: string | undefined;
	data: AssistantData | undefined;
};

export const AssistantContent = ({ spaceId, paperId, data }: Props) => {
	const { user } = useUser();

	const queryClient = useQueryClient();
	const { selectedTupleId, isAssistantExpanded, expandAssistant } =
		useAssistant();
	const { setId } = useLatestSubmitId();

	const [contentRef, { height: contentHeight }] = useMeasure();
	const [headerRef, { height: headerHeight }] = useMeasure();
	const [footerRef, { height: footerHeight }] = useMeasure();
	const [suggestionsRef, { height: suggestionsHeight }] = useMeasure();

	const initialMessages = useMemo(
		() => toInitialMessages(data?.posts ?? []),
		[data?.posts],
	);

	const {
		messages,
		append,
		stop,
		data: streamData,
		isLoading,
	} = useChat({
		id: `${user?.id ?? "anonymous"}-${spaceId ?? "nospace"}-${
			paperId ?? "nopaper"
		}`,
		body: {
			title: data?.paper?.data.title,
			abstract: data?.paper?.data.abstract,
			paperId: data?.paper?.id,
			spaceId,
		},
		api: "/api/ai",
		maxSteps: 2,
		// initialMessages,
	});

	const messagesWithoutToolCalls = useMemo(
		() =>
			[...initialMessages, ...messages].reduce((acc, obj) => {
				// Filter out tool calls
				if (obj.toolInvocations) return acc;
				// TODO: This is too crude e.g. as it filters out questions, but not their related answer
				// Filter out duplicates when overwriting useChat messages with initialMessages on a ongoing bases
				if (acc.some((m) => m.content.length > 0 && m.content === obj.content))
					return acc;

				acc.push(obj);
				return acc;
			}, [] as Message[]),
		[initialMessages, messages],
	);

	const handleSubmit = (input: string) => {
		setId(paperId ?? spaceId);
		append({ role: "user", content: input, createdAt: new Date() });
		expandAssistant();
	};

	const handleAbort = () => {
		setId(undefined);
		stop();
		trackHandler(analyticsKeys.assistant.ask.abort)();
	};

	const tuplePosts = useMemo(
		() =>
			toTuplePosts(
				data?.posts ?? [],
				messagesWithoutToolCalls as MessageWithMetadata[],
				isLoading,
				user,
			),
		[data?.posts, messagesWithoutToolCalls, isLoading, user],
	);

	const followUps = useMemo(
		() => getFollowUps(streamData as AnswerEngineEvents[]),
		[streamData],
	);

	const suggestions = useMemo(() => {
		if (followUps.length > 0) {
			return followUps;
		}
		return data?.paper?.generated?.starters ?? [];
	}, [followUps, data?.paper?.generated?.starters]);

	const selectedTuple = tuplePosts.find((tp) => tp.slug === selectedTupleId);

	useEffect(() => {
		if (!isLoading) {
			queryClient.invalidateQueries({
				queryKey: [PROEM_ASSISTANT_QUERY_KEY, spaceId, paperId, user?.id],
			});
		}
	}, [isLoading, queryClient, spaceId, paperId, user?.id]);

	return (
		<DrawerContent className="max-w-xl mx-auto flex border-none bg-theme-900 h-full">
			<div className="absolute top-0 right-0 m-1">
				<DrawerClose asChild>
					<Button
						size="icon"
						className="text-neutral-50 hover:text-neutral-200 duration-200 bg-transparent hover:bg-transparent"
					>
						<X className="size-6" />
					</Button>
				</DrawerClose>
			</div>
			<Dialog>
				<DialogTitle className="hidden" />
				<DialogDescription className="hidden" />
			</Dialog>
			<div
				className="flex flex-col justify-between h-[calc(100%-24px)]"
				ref={contentRef}
			>
				{selectedTuple && <InspectAnswer tuple={selectedTuple} />}
				{!selectedTupleId && (
					<Header
						spaceName={data?.space?.name ?? "Discover"}
						spaceId={data?.space?.id}
						paperTitle={
							data?.paper?.generated?.title ?? data?.paper?.data.title
						}
						ref={headerRef}
					/>
				)}
				{!selectedTupleId && (
					<PreviousQuestions
						posts={tuplePosts}
						spaceId={spaceId}
						paperId={paperId}
						height={contentHeight - headerHeight - footerHeight}
						onSubmit={handleSubmit}
						onAbort={handleAbort}
						isLoading={isLoading}
					/>
				)}
				<motion.div
					className="flex flex-col gap-1 px-3 pb-3"
					ref={footerRef}
					animate={{
						opacity: isAssistantExpanded ? 0 : 1,
						marginBottom: isAssistantExpanded ? -footerHeight : 0,
					}}
				>
					<AskScienceForm paper={!!paperId} onSubmit={handleSubmit} />
					<SuggestedQuestions
						ref={suggestionsRef}
						height={suggestionsHeight}
						onSubmit={handleSubmit}
						suggestions={suggestions}
						suggestionType={followUps.length > 0 ? "followup" : "generated"}
					/>
				</motion.div>
			</div>
		</DrawerContent>
	);
};

/**
 * Convert posts and comments from DB to Vercel AI messages w/ metadata; such as
 * author, source papers, follow-ups, etc.
 */
const toInitialMessages = (posts: PostWithCommentsAndAuthor[]) => {
	const messages: MessageWithMetadata[] = [];
	for (const post of posts) {
		messages.push({
			id: generateId(),
			role: "user",
			content: post.content,
			createdAt: new Date(post.createdAt),
			metadata: {
				slug: post.slug,
				shared: post.shared,
				author: {
					id: post.authorId,
					firstName: post.author.firstName,
					lastName: post.author.lastName,
					imageUrl: post.author.imageUrl,
				},
			},
		} satisfies MessageWithMetadata);
		for (const comment of post.comments) {
			messages.push({
				id: generateId(),
				role: comment.authorId === PAPER_BOT_USER_ID ? "assistant" : "user",
				content: comment.content,
				createdAt: new Date(comment.createdAt),
				metadata: {
					shared: post.shared,
					followUps: comment.followUps,
					papers: comment.papers,
				},
			});
		}
	}
	return messages;
};

const toTuplePosts = (
	posts: AssistantData["posts"],
	messages: MessageWithMetadata[],
	isLoading: boolean,
	user: User,
) => {
	// Use posts from assistant data (includes slug, papers, etc.)
	if (!isLoading && posts.length * 2 === messages.length) {
		return posts
			.map(
				(post) =>
					({
						id: generateId(),
						createdAt: new Date(post.createdAt),
						content: post.content,
						author: {
							id: post.authorId,
							firstName: post.author?.firstName ?? null,
							lastName: post.author?.lastName ?? null,
							imageUrl: post.author?.imageUrl,
						},
						slug: post.slug,
						reply: post.comments[0] && {
							content: post.comments[0].content,
							metadata: {
								authorId: post.comments[0].authorId,
								followUps: post.comments[0].followUps,
								papers: post.comments[0].papers,
							},
						},
					}) satisfies TuplePost,
			)
			.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
	}

	// Use messages from chat stream, if streaming
	const tuplePosts: TuplePost[] = [];
	for (let i = 0; i < messages.length; i++) {
		const message = messages[i];
		if (message?.role === "user") {
			const nextMessage = messages[i + 1];
			// const  nextMessage = user (i ) => assisten uden tool calls
			tuplePosts.push({
				id: message.id,
				createdAt: message.createdAt,
				content: message.content,
				author:
					message.metadata?.author?.id === ANONYMOUS_USER_ID
						? {
								id: message.metadata?.author?.id ?? ANONYMOUS_USER_ID,
								firstName: message.metadata?.author?.firstName ?? null,
								lastName: message.metadata?.author?.lastName ?? null,
								imageUrl: message.metadata?.author?.imageUrl,
							}
						: {
								id:
									message.metadata?.author?.id ?? user?.id ?? ANONYMOUS_USER_ID,
								firstName:
									message.metadata?.author?.firstName ??
									user?.firstName ??
									null,
								lastName:
									message.metadata?.author?.lastName ?? user?.lastName ?? null,
								imageUrl: message.metadata?.author?.imageUrl ?? user?.imageUrl,
							},
				slug: message.metadata?.slug ?? null,
				reply: nextMessage
					? {
							content: nextMessage.content,
							metadata: {
								authorId: nextMessage.metadata?.author?.id ?? PAPER_BOT_USER_ID,
								followUps: nextMessage.metadata?.followUps ?? null,
								papers: nextMessage.metadata?.papers ?? null,
							},
						}
					: undefined,
			} satisfies TuplePost);
		}
	}
	return tuplePosts.sort(
		(a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
	);
};

const getFollowUps = (data: AnswerEngineEvents[]) =>
	findLatestByEventType(data, "follow-up-questions-generated")
		.hits.at(0)
		?.map((hit) => hit.question) ?? [];
