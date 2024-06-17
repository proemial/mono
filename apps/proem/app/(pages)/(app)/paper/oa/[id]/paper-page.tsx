import { fetchPaper } from "@/app/(pages)/(app)/paper/oa/[id]/fetch-paper";
import { generate } from "@/app/(pages)/(app)/paper/oa/[id]/llm-generate";
import { PaperReader } from "@/app/(pages)/(app)/paper/oa/[id]/paper-reader";
import { PaperReaderSkeleton } from "@/app/(pages)/(app)/paper/oa/[id]/paper-reader-skeleton";
import { getInternalUser } from "@/app/hooks/get-internal-user";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { fetchArxivPaper } from "../../arxiv/[id]/fetch-arxiv-paper";
import {
	PaperPost,
	getOrgMemberPaperPosts,
	getOwnPaperPosts,
} from "../../paper-post-utils";
import { addPaperActivity } from "./paper-activity";

type Props = {
	paperId: string;
	type: "oa" | "arxiv";
};

export default async function PaperPage({ paperId, type }: Props) {
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

	// TODO: Remove feature flag
	const { isInternal } = getInternalUser();
	// Get paper posts from org members, or user's own posts if there are none
	let paperPosts: PaperPost[] = [];
	if (isInternal) {
		paperPosts = await getOrgMemberPaperPosts(paperId);
		if (paperPosts.length === 0) {
			paperPosts = await getOwnPaperPosts(paperId);
		}
	}

	const addPaperActivityPromise = addPaperActivity(paperId);

	return (
		<Suspense fallback={<PaperReaderSkeleton />}>
			<PaperReader
				fetchedPaperPromise={fetchedPaperPromise}
				generatedPaperPromise={generatedPaperPromise}
				addPaperActivityPromise={addPaperActivityPromise}
				paperPosts={paperPosts}
			/>
		</Suspense>
	);
}
