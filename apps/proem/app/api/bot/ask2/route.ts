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

		return await handleAskRequest(requestData);
	} catch (e) {
		return NextResponse.json(e, { status: 500 });
	}
}
