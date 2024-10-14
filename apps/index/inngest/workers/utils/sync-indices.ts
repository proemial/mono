import {
	defaultVectorSpaceName,
	VectorSpace,
	vectorSpaces,
} from "@/data/db/vector-spaces";
import { inngest } from "../../client";
import { Time } from "@proemial/utils/time";
import { QdrantPapers as Qdrant } from "@/data/db/qdrant";
import { generateEmbeddings } from "@/data/db/embeddings";
import { QdrantPaper } from "@/inngest/helpers/qdrant.model";

const eventName = "ingest/sync";
const eventId = "ingest/sync/fn";

const windowSize = 200;
const maxUpsert = 300000;

export const syncIndicesStream = {
	name: eventName,
	worker: inngest.createFunction(
		{ id: eventId, concurrency: 1 },
		{ event: eventName },
		async ({ event }) => {
			const result = {} as { [key: string]: number };

			const begin = Time.now();
			const payload = { ...event.data };

			if (!payload.from) {
				payload.from = defaultVectorSpaceName;
			}
			if (!payload.to) {
				throw new Error("No target index provided");
			}

			if (!vectorSpaces[payload.from] || !vectorSpaces[payload.to]) {
				throw new Error(
					`Unknown vector space: ${payload.from} or ${payload.to}`,
				);
			}

			console.log(
				"[Qdrant.all",
				payload.from,
				payload.nextPageOffset,
				windowSize,
			);
			const unfilteredIdsResponse = await Qdrant.all(
				vectorSpaces[payload.from] as VectorSpace,
				payload.nextPageOffset,
				windowSize,
			);
			const unfilteredIds = unfilteredIdsResponse.points;
			result.fetched = unfilteredIds.length;

			console.log(
				"[Qdrant.byIds",
				payload.to,
				unfilteredIds.length,
				windowSize,
				false,
			);
			const matchedIdsResponse = await Qdrant.byIds(
				vectorSpaces[payload.to] as VectorSpace,
				unfilteredIds.map((d) => d.id as string),
				windowSize,
				false,
			);
			result.matched = matchedIdsResponse.points.length;

			const unmatchedIds = unfilteredIds.filter(
				(d) => !matchedIdsResponse.points.some((m) => m.id === d.id),
			);
			result.unmatched = unmatchedIds.length;

			console.log(
				"[Qdrant.byIds",
				payload.from,
				unmatchedIds.length,
				windowSize,
			);
			const unmatchedPapersResponse = await Qdrant.byIds(
				vectorSpaces[payload.from] as VectorSpace,
				unmatchedIds.map((d) => d.id as string),
				windowSize,
			);
			const unmatchedPapers = unmatchedPapersResponse.points as QdrantPaper[];
			result.refetched = unmatchedPapers.length;

			let totalUpserted = payload.totalUpserted ?? 0;
			if (unmatchedPapers.length) {
				console.log(
					"[syncIndicesStream][generateEmbeddings]",
					unmatchedPapers.length,
					payload.to,
				);
				const embeddings = await generateEmbeddings(
					unmatchedPapers,
					vectorSpaces[payload.to] as VectorSpace,
					async (count, elapsed) => {
						console.log(
							"[syncIndicesStream][embedded] generated ",
							count,
							"embeddings in",
							elapsed,
							"ms",
						);
					},
				);
				result.embeddings = embeddings.length;

				console.log(
					"[syncIndicesStream][upsert]",
					unmatchedPapers.length,
					embeddings.length,
					payload.to,
				);
				const upserted = await Qdrant.upsert(
					unmatchedPapers,
					embeddings,
					vectorSpaces[payload.to] as VectorSpace,
					async (count, elapsed) => {
						console.log(
							"[syncIndicesStream][upserted] upserted ",
							count,
							"papers in",
							elapsed,
							"ms",
						);
					},
				);
				result.upserted = upserted ? unmatchedPapers.length : 0;
				totalUpserted = totalUpserted + result.upserted;
			}
			const totalFetched =
				(payload.totalFetched ?? 0) + unfilteredIdsResponse.points.length;

			console.log(
				"[syncIndicesStream][inngest check]",
				unfilteredIdsResponse.next_page_offset,
				totalUpserted,
				maxUpsert,
			);

			if (unfilteredIdsResponse.next_page_offset && totalUpserted < maxUpsert) {
				const nextPayload = {
					...payload,
					totalUpserted,
					totalFetched,
					nextPageOffset: unfilteredIdsResponse.next_page_offset,
				};

				console.log(
					"[syncIndicesStream][inngest.send[",
					eventName,
					nextPayload,
				);
				await inngest.send({
					name: eventName,
					data: nextPayload,
				});
			}

			return {
				event,
				body: {
					result,
					totalUpserted,
					totalFetched,
					nextPageOffset: unfilteredIdsResponse.next_page_offset,
					elapsed: Time.elapsed(begin),
				},
			};
		},
	),
};
