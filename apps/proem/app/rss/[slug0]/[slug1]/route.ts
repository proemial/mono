import { NextRequest } from "next/server";
import { Redis } from "@proemial/adapters/redis";
import { QdrantPapers } from "@proemial/adapters/qdrant/papers";
import { defaultVectorSpace } from "@proemial/adapters/qdrant/vector-spaces";

export async function GET(
	req: NextRequest,
	{ params }: { params: { slug0: string; slug1: string } },
) {
	const space = await Redis.spaces.get([params.slug0, params.slug1]);
	const response = await QdrantPapers.search(
		defaultVectorSpace.collection,
		[space?.vectors.like, space?.vectors.unlike].filter(
			(v) => !!v,
		) as number[][],
		space?.query.period,
	);

	const xml = `<feed>${response.papers?.map((p) => `<item>${p.title}</item>`).join("")}</feed>`;
	// feed.addCategory("Technologie");

	return new Response(xml, {
		headers: { "Content-Type": "text/xml" },
	});
}
