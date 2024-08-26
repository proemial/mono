import { handleAskRequest } from "@/app/api/bot/ask2/handle-ask-request";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
	try {
		const requestData = await req.json();
		return await handleAskRequest(requestData);
	} catch (e) {
		return NextResponse.json(e, { status: 500 });
	}
}
