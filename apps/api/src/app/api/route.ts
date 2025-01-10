import qdrantHelper from "@proemial/adapters/qdrant/adapter";
import { NextResponse } from "next/server";

export const revalidate = 0;

const qdrant = qdrantHelper({
	url: process.env.QDRANT_QA_URL as string,
	apiKey: process.env.QDRANT_QA_API_KEY as string,
});

export const GET = async () => {
	const name = "foo";

	const created = await qdrant.spaces.create(name);
	const collection = await qdrant.spaces.get(name);
	const points = await qdrant.points.count(name);
	const deleted = await qdrant.spaces.delete(name);

	return NextResponse.json({
		result: { create: created, deleted },
		collection,
		points,
	});
};
