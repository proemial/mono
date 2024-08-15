import { AssistantData } from "@/app/api/assistant/route";
import {
	AnswerEngineEvents,
	findLatestByEventType,
} from "@/app/api/bot/answer-engine/events";
import { PAPER_BOT_USER_ID } from "@/app/constants";
import { PaperPost, UserData } from "@/services/post-service";
import { useUser } from "@clerk/nextjs";
import { Answer, Post } from "@proemial/data/neon/schema";
import { DrawerContent } from "@proemial/shadcn-ui";
import { DialogTitle } from "@proemial/shadcn-ui/components/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";
import { nanoid } from "ai";
import { Message, useChat } from "ai/react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import useMeasure from "react-use-measure";
import { AskScienceForm } from "./ask-science-form";
import { PROEM_ASSISTANT_QUERY_KEY } from "./assistant";
import { Header } from "./assistant-header";
import { PreviousQuestions } from "./previous-questions";
import { SuggestedQuestions } from "./suggested-questions";
import { TuplePost } from "./tuple";

type User = ReturnType<typeof useUser>["user"];

export type MessageWithAuthorUserData = Message & {
	createdAt: Date;
	authorUserData?: UserData;
	shared?: Post["shared"];
	answerMetadata?: {
		slug: Answer["slug"];
		shareId: Answer["shareId"];
		ownerId: Answer["ownerId"];
		followUpQuestions: Answer["followUpQuestions"];
		papers: Answer["papers"];
	};
};

type Props = {
	spaceId: string | undefined;
	paperId: string | undefined;
	data: AssistantData | undefined;
	expanded: boolean;
	setExpanded: (expanded: boolean) => void;
};

export const AssistantContent = ({
	spaceId,
	paperId,
	data,
	expanded,
	setExpanded,
}: Props) => {
	const { user } = useUser();

	const [inputFocused, setInputFocused] = useState(false);
	const queryClient = useQueryClient();

	const [contentRef, { height: contentHeight }] = useMeasure();
	const [headerRef, { height: headerHeight }] = useMeasure();
	const [footerRef, { height: footerHeight }] = useMeasure();
	const [suggestionsRef, { height: suggestionsHeight }] = useMeasure();

	const initialMessages = useMemo(
		() => toInitialMessages(data?.posts ?? [], data?.answers ?? [], user),
		[data?.posts, data?.answers, user],
	);

	const {
		messages,
		append,
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
			userId: user?.id,
		},
		api: !paperId ? "/api/bot/ask2" : "/api/ai",
		initialMessages,
	});

	const handleSubmit = (input: string) => {
		append({ role: "user", content: input, createdAt: new Date() });
		setExpanded(true);
	};

	const tuplePosts = useMemo(
		() => toTuplePosts(messages as MessageWithAuthorUserData[], user),
		[messages, user],
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

	useEffect(() => {
		if (!isLoading) {
			queryClient.invalidateQueries({
				queryKey: [PROEM_ASSISTANT_QUERY_KEY, spaceId, paperId, user?.id],
			});
		}
	}, [isLoading, queryClient, spaceId, paperId, user?.id]);

	return (
		<DrawerContent className="max-w-xl mx-auto flex border-none bg-theme-900 h-full">
			<DialogTitle className="hidden" />
			<div
				className="flex flex-col justify-between h-[calc(100%-24px)]"
				ref={contentRef}
			>
				<Header
					spaceName={data?.space?.name ?? "For You"}
					spaceId={data?.space?.id}
					paperTitle={data?.paper?.generated?.title ?? data?.paper?.data.title}
					ref={headerRef}
				/>
				<PreviousQuestions
					posts={tuplePosts}
					userId={user?.id}
					spaceId={spaceId}
					height={contentHeight - headerHeight - footerHeight}
					expanded={expanded}
					setExpanded={setExpanded}
					onSubmit={handleSubmit}
				/>
				<motion.div
					className="flex flex-col gap-1 px-3 pb-3"
					ref={footerRef}
					animate={{
						opacity: expanded ? 0 : 1,
						marginBottom: expanded ? -footerHeight : 0,
					}}
				>
					<AskScienceForm
						paper={!!paperId}
						setInputFocused={setInputFocused}
						onSubmit={handleSubmit}
					/>
					<SuggestedQuestions
						hidden={inputFocused}
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
 * Convert posts and comments from DB to Vercel AI messages w/ author data.
 */
const toInitialMessages = (
	posts: PaperPost[],
	answers: Answer[],
	user: User | undefined,
) => [...toInitialPosts(posts), ...toInitialAnswers(answers, user)];

const toInitialPosts = (posts: PaperPost[]) => {
	const messages: MessageWithAuthorUserData[] = [];
	for (const post of posts) {
		messages.push({
			id: nanoid(),
			role: "user",
			content: post.content,
			createdAt: new Date(post.createdAt),
			authorUserData: {
				userId: post.authorId,
				firstName: post.author.firstName,
				lastName: post.author.lastName,
				imageUrl: post.author.imageUrl,
			},
			shared: post.shared,
		});
		for (const comment of post.comments) {
			messages.push({
				id: nanoid(),
				role: comment.authorId === PAPER_BOT_USER_ID ? "assistant" : "user",
				content: comment.content,
				createdAt: new Date(comment.createdAt),
				shared: post.shared,
			});
		}
	}
	return messages;
};

const toInitialAnswers = (answers: Answer[], user: User | undefined) => {
	if (!user) return [];
	const messages: MessageWithAuthorUserData[] = [];
	for (const answer of answers) {
		messages.push({
			id: nanoid(),
			role: "user",
			content: answer.question,
			createdAt: new Date(answer.createdAt),
			authorUserData: user?.id
				? {
						userId: user?.id,
						firstName: user?.firstName ?? null,
						lastName: user?.lastName ?? null,
						imageUrl: user?.imageUrl,
					}
				: undefined,
		});
		messages.push({
			id: nanoid(),
			role: "assistant",
			content: answer.answer,
			createdAt: new Date(answer.createdAt),
			answerMetadata: {
				slug: answer.slug,
				shareId: answer.shareId,
				ownerId: answer.ownerId,
				followUpQuestions: answer.followUpQuestions,
				papers: answer.papers,
			},
		});
	}
	return messages;
};

/**
 * Convert Vercel AI messages to tuple posts
 */
const toTuplePosts = (messages: MessageWithAuthorUserData[], user: User) => {
	const tuplePosts: TuplePost[] = [];
	for (let i = 0; i < messages.length; i++) {
		const message = messages[i];
		if (message?.role === "user") {
			const nextMessage = messages[i + 1];
			const reply: TuplePost["reply"] =
				nextMessage?.role === "assistant"
					? {
							content: nextMessage.content,
							answerMetadata: nextMessage.answerMetadata,
						}
					: undefined;
			tuplePosts.push({
				id: message.id,
				content: message.content,
				author: {
					id: message.authorUserData?.userId ?? user?.id ?? "anonymous",
					firstName:
						message.authorUserData?.firstName ?? user?.firstName ?? "Me",
					lastName: message.authorUserData?.lastName ?? user?.lastName ?? null,
					imageUrl: message.authorUserData?.imageUrl ?? user?.imageUrl,
				},
				createdAt: message.createdAt,
				reply,
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
