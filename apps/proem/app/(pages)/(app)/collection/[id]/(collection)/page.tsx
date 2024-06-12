import { neonDb } from "@proemial/data";
import { collections } from "@proemial/data/neon/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import FeedItem from "../../../discover/feed-item";
import { fetchPaper } from "../../../paper/oa/[id]/fetch-paper";

type PageProps = {
	params?: {
		id: string;
	};
};

export default async function ({ params }: PageProps) {
	if (!params?.id) {
		notFound();
	}

	const collection = await neonDb.query.collections.findFirst({
		where: eq(collections.slug, params.id),
		with: {
			collectionsToPapers: {
				columns: {
					paperId: true,
				},
			},
		},
	});
	if (!collection) {
		notFound();
	}

	const paperIds = collection.collectionsToPapers.map((c) => c.paperId);
	const papers = await Promise.all(
		paperIds.map((paperId) => fetchPaper(paperId)),
	);

	if (paperIds.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center gap-4">
				<div className="text-sm">
					There are no papers in this collection yet.
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-8 my-8">
			{papers.map(
				(paper) => paper && <FeedItem key={paper.id} paper={paper} />,
			)}
		</div>
	);
}
