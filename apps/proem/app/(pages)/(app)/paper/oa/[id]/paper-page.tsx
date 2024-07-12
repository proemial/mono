import { fetchPaper } from "@/app/(pages)/(app)/paper/oa/[id]/fetch-paper";
import { generate } from "@/app/(pages)/(app)/paper/oa/[id]/llm-generate";
import { PaperReader } from "@/app/(pages)/(app)/paper/oa/[id]/paper-reader";
import { PaperReaderSkeleton } from "@/app/(pages)/(app)/paper/oa/[id]/paper-reader-skeleton";
import { getBookmarksByCollectionId } from "@/app/(pages)/(app)/space/(discover)/get-bookmarks-by-collection-id";
import {
	MessageWithAuthorUserData,
	PostService,
} from "@/services/post-service";
import { getUsers } from "@/utils/auth";
import { auth } from "@clerk/nextjs";
import { nanoid } from "ai";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { fetchArxivPaper } from "../../arxiv/[id]/fetch-arxiv-paper";

type Props = {
	paperId: string;
	type: "oa" | "arxiv";
	collectionId?: string;
};

export default async function PaperPage({
	paperId,
	type,
	collectionId,
}: Props) {
	const fetchPaperFn = type === "oa" ? fetchPaper : fetchArxivPaper;
	const fetchedPaperPromise = fetchPaperFn(paperId).then((paper) => {
		if (!paper) {
			notFound();
		}
		return paper;
	});

	const generatedPaperPromise = fetchedPaperPromise.then((paper) => {
		return generate(paper, type === "oa" ? "oa" : "arxiv");
	});

	const { userId } = auth();
	const bookmarks = userId
		? await getBookmarksByCollectionId(collectionId ?? userId)
		: {};
	const isBookmarked = Boolean(bookmarks[paperId]);
	const paperIdWithPosts = await PostService.getSinglePaperIdWithPosts(
		paperId,
		collectionId,
	);
	const initialMessages = await toInitialMessages(paperIdWithPosts);

	return (
		<Suspense fallback={<PaperReaderSkeleton />}>
			<PaperReader
				isBookmarked={isBookmarked}
				fetchedPaperPromise={fetchedPaperPromise}
				generatedPaperPromise={generatedPaperPromise}
				initialMessages={initialMessages}
				type={type}
				collectionId={collectionId}
			/>
		</Suspense>
	);
}

const toInitialMessages = async (
	paperIdWithPosts: Awaited<
		ReturnType<typeof PostService.getSinglePaperIdWithPosts>
	>,
): Promise<MessageWithAuthorUserData[]> => {
	if (!paperIdWithPosts) {
		return [];
	}
	const messages: MessageWithAuthorUserData[] = [];
	const authors = await getUsers(
		paperIdWithPosts.posts.map((post) => post.authorId),
	);

	for (const post of paperIdWithPosts.posts) {
		const author = authors.find((user) => user.id === post.authorId);
		// Skip post if author user does not exist in auth provider
		if (!author) {
			continue;
		}
		messages.push({
			id: nanoid(),
			role: "user",
			content: post.content,
			createdAt: post.createdAt,
			authorUserData: {
				userId: post.authorId,
				firstName: author.firstName,
				lastName: author.lastName,
				hasImage: author.hasImage,
				imageUrl: author.imageUrl,
			},
			shared: post.shared,
		});
		for (const comment of post.comments) {
			messages.push({
				id: nanoid(),
				role: "assistant",
				content: comment.content,
				createdAt: comment.createdAt,
				shared: post.shared,
			});
		}
	}
	return messages;
};
