import { searchAction } from "@/app/actions/search-action";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
	const { query, from } = (await request.json()) as {
		query: string;
		from: string;
	};

	const formData = new FormData();
	formData.append("query", query);
	formData.append("from", from);
	formData.append("count", "10");
	// formData.append("index", "o3s1536alpha");
	formData.append("index", "1.5k");
	formData.append("negatedQuery", "");
	formData.append("fullVectorSearch", "false");

	const result = await searchAction(undefined, formData);

	return NextResponse.json(result);
};
