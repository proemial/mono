import { NextResponse } from "next/server";
import { diffbot } from "./scrapers/diffbot";

export const revalidate = 0;

export async function POST(request: Request) {
	const { url } = (await request.json()) as { url: string };

	const article = await diffbot(url);
	return NextResponse.json(article);
}
