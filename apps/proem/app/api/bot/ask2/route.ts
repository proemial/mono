import { handleAskRequest } from "@/app/api/bot/ask2/handle-ask-request";
import { ratelimitByIpAddress } from "@/utils/ratelimiter";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
	try {
		const requestData = await req.json();
		const { success } = await ratelimitByIpAddress(req.ip);
		if (!success) {
			return NextResponse.json({ error: "Rate limited" }, { status: 429 });
		}

		const { stream, data } = await handleAskRequest(requestData);

		return NextResponse.json(
			{
				error: "This answer engine is no longer supported (since AI SDK v4.0)",
			},
			{ status: 404 },
		);
	} catch (e) {
		return NextResponse.json(e, { status: 500 });
	}
}
