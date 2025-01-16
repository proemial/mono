import qdrantHelper from "@proemial/adapters/qdrant/adapter";
import { NextResponse } from "next/server";

export const revalidate = 0;

const qdrant = qdrantHelper({
	url: process.env.QDRANT_QA_URL as string,
	apiKey: process.env.QDRANT_QA_API_KEY as string,
});

// TODO: Answer question with references
export const GET = async () => {
	return NextResponse.json({ status: "TODO" });
};
