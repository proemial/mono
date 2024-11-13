import { getItems } from "@/app/(pages)/news/cached-items";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
	revalidateTag("news-feed");
	const items = await getItems(true);

	return NextResponse.json({ message: "success", count: items.length });
}
