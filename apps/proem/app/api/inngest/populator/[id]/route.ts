import { populateCache } from "@/inngest/populator.task";
import { NextRequest } from "next/server";

export const revalidate = 1;

// user_2hYK6W88BSMGFdUrXEiehLncd1f
export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	const result = await populateCache(params.id);
	return Response.json(result);
}
