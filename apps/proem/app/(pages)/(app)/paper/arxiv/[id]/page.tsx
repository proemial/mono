import { generate } from "@/app/(pages)/(app)/paper/oa/[id]/llm-generate";
import { PaperReader } from "@/app/(pages)/(app)/paper/oa/[id]/paper-reader";
import { PaperReaderSkeleton } from "@/app/(pages)/(app)/paper/oa/[id]/paper-reader-skeleton";
import { getInternalUser } from "@/app/hooks/get-internal-user";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
	PaperPost,
	getOrgMemberPaperPosts,
	getOwnPaperPosts,
} from "../../paper-post-utils";
import { fetchArxivPaper } from "./fetch-arxiv-paper";

const description = "Read science fast";

type Props = {
	params: { id: string };
};

export default async function ArXivReaderPage({ params }: Props) {
	const fetchedPaperPromise = fetchArxivPaper(params.id).then((paper) => {
		if (!paper) {
			notFound();
		}

		return paper;
	});

	const generatedPaperPromise = fetchedPaperPromise.then((paper) => {
		return generate(paper, "arxiv");
	});

	// TODO: Remove feature flag
	const { isInternal } = getInternalUser();
	// Get paper posts from org members, or user's own posts if there are none
	let paperPosts: PaperPost[] = [];
	if (isInternal) {
		paperPosts = await getOrgMemberPaperPosts(params.id);
		if (paperPosts.length === 0) {
			paperPosts = await getOwnPaperPosts(params.id);
		}
	}

	return (
		<Suspense fallback={<PaperReaderSkeleton />}>
			<PaperReader
				fetchedPaperPromise={fetchedPaperPromise}
				generatedPaperPromise={generatedPaperPromise}
				paperPosts={paperPosts}
			/>
		</Suspense>
	);
}
