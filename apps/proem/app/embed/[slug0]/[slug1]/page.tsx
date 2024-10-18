import PaperCard, { FeedPaper } from "./components/card";
import { getSummaries as getCacheSummaries } from "@proemial/adapters/llm/cache/summaries";
import { QdrantPapers } from "@proemial/adapters/qdrant/papers";
import { defaultVectorSpace } from "@proemial/adapters/qdrant/vector-spaces";
import { Redis } from "@proemial/adapters/redis";
import { OpenAlexPaperWithAbstract } from "@proemial/repositories/oa/models/oa-paper";
import { findCollectionBySlugs } from "@proemial/data/repository/collection";
import { ProemLogo } from "@/components/icons/brand/logo";
import { Time } from "@proemial/utils/time";

type Props = {
	params: {
		slug0: string;
		slug1: string;
	};
	searchParams: {
		count?: string;
		foreground?: string;
		background?: string;
	};
};

export default async function EmbedVectorSpacePage({
	params,
	searchParams,
}: Props) {
	const background = searchParams.background;
	const count = searchParams.count ? Number.parseInt(searchParams.count) : 18;
	const limit = Math.min(count, 18);

	let begin = Time.now();
	const papers = await findPapers(params.slug0, params.slug1, limit);
	Time.log(begin, "[embed][find]");

	begin = Time.now();
	const redisSummaries = await getSummaries(papers);
	Time.log(begin, "[embed][summarise]");

	begin = Time.now();
	const collectionId = (await findCollectionBySlugs(params.slug0, params.slug1))
		?.id;
	Time.log(begin, "[embed][collection]");

	const items = papers.map((paper) => {
		const summaries =
			redisSummaries.find((s) => s.paperId === paper.id)?.summaries ?? {};
		const path = getLink(paper, collectionId, params.slug0, params.slug1);

		return {
			id: paper.id,
			data: paper,
			generated: {
				title: summaries.title?.summary,
				abstract: summaries.description?.summary,
			},
			path,
		} as FeedPaper;
	});

	return (
		<div className={"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"}>
			{items.map((item) => (
				<EmbedItem
					key={item.id}
					paper={item}
					space={collectionId ?? ""}
					background={background && `#${background}`}
				/>
			))}
		</div>
	);
}

function EmbedItem({
	paper,
	space,
	background,
}: {
	paper: FeedPaper;
	space: string;
	background?: string;
}) {
	const style = background ? { background } : {};

	return (
		<div key={paper.id} className={"p-3 border border-[#cccccc]"} style={style}>
			<PaperCard paper={paper} customCollectionId={space} />

			<div className="relative bottom-4 flex justify-end">
				<ProemLogo className="w-4 h-4" />
			</div>
		</div>
	);
}

async function findPapers(slug0: string, slug1: string, limit: number) {
	const space = await Redis.spaces.get([slug0, slug1]);
	const result = await QdrantPapers.search(
		defaultVectorSpace.collection,
		[space?.vectors.like, space?.vectors.unlike].filter(
			(v) => !!v,
		) as number[][],
		space?.query.period,
		space?.runtime.quantization,
		limit,
	);

	return result.papers?.map((p) => p.paper) ?? [];
}

async function getSummaries(papers: OpenAlexPaperWithAbstract[]) {
	return await Promise.all(
		papers.map(async (p) => ({
			paperId: p.id,
			summaries: await getCacheSummaries(p.id, p.title, p.abstract ?? ""),
		})) ?? [],
	);
}

function getLink(
	paper: OpenAlexPaperWithAbstract,
	collectionId: string | undefined,
	slug0: string,
	slug1: string,
) {
	const path = `/paper/oa/${paper.id.split("/").at(-1)}`;
	const utm = `?utm_source=${slug0}~${slug1}&utm_medium=embed`;
	return collectionId ? `/space/${collectionId}${path}${utm}` : `${path}${utm}`;
}
