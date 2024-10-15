import React from "react";
import { Redis } from "@proemial/adapters/redis";
import { QdrantPapers } from "@proemial/adapters/qdrant/papers";
import {
	defaultVectorSpace,
	vectorSpaces,
} from "@proemial/adapters/qdrant/vector-spaces";

export default async function EmbedVectorSpacePage({
	params,
}: { params: { slug0: string; slug1: string } }) {
	const space = await Redis.spaces.get([params.slug0, params.slug1]);
	const response = await QdrantPapers.search(
		defaultVectorSpace.collection,
		[space?.vectors.like, space?.vectors.unlike].filter(
			(v) => !!v,
		) as number[][],
		space?.query.period,
	);

	return (
		<div>
			<div>
				{response.papers?.map((p) => (
					<div key={p.paper.id}>{p.paper.title}</div>
				))}
			</div>
			<div>
				<pre>{JSON.stringify(response.metrics, null, 2)}</pre>
			</div>
		</div>
	);
}
