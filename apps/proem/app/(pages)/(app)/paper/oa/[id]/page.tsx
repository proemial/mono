import { fetchPaper } from "@/app/(pages)/(app)/paper/oa/[id]/fetch-paper";
import { generate } from "@/app/(pages)/(app)/paper/oa/[id]/llm-generate";
import { PaperReader } from "@/app/(pages)/(app)/paper/oa/[id]/paper-reader";
import { PaperReaderSkeleton } from "@/app/(pages)/(app)/paper/oa/[id]/paper-reader-skeleton";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
	getOrgMemberPaperPosts,
	getOwnPaperPosts,
} from "../../paper-post-utils";

const description = "Read science fast";

type Props = {
	params: { id: string };
};

export default async function ReaderPage({ params }: Props) {
	const fetchedPaperPromise = fetchPaper(params.id).then((paper) => {
		if (!paper) {
			notFound();
		}

		return paper;
	});

	const generatedPaperPromise = fetchedPaperPromise.then((paper) => {
		return generate(paper);
	});

	// Get paper posts from org members, or user's own posts if there are none
	let paperPosts = await getOrgMemberPaperPosts(params.id);
	if (paperPosts.length === 0) {
		paperPosts = await getOwnPaperPosts(params.id);
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
