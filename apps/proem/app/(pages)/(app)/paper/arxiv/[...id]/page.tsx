import { generate } from "@/app/(pages)/(app)/paper/oa/[id]/llm-generate";
import { PaperReader } from "@/app/(pages)/(app)/paper/oa/[id]/paper-reader";
import { PaperReaderSkeleton } from "@/app/(pages)/(app)/paper/oa/[id]/paper-reader-skeleton";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { fetchArxivPaper } from "./fetch-arxiv-paper";

const description = "Read science fast";

type Props = {
	params: { id: string[] };
};

export default async function ArXivReaderPage({ params }: Props) {
	const fetchedPaperPromise = fetchArxivPaper(params.id.join("/")).then(
		(paper) => {
			if (!paper) {
				notFound();
			}

			return paper;
		},
	);

	const generatedPaperPromise = fetchedPaperPromise.then((paper) => {
		return generate(paper, "arxiv");
	});

	return (
		<Suspense fallback={<PaperReaderSkeleton />}>
			<PaperReader
				fetchedPaperPromise={fetchedPaperPromise}
				generatedPaperPromise={generatedPaperPromise}
			/>
		</Suspense>
	);
}
