import { ratelimitByIpAddress } from "@/utils/ratelimiter";
import { geolocation } from "@vercel/edge";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
	const { success } = await ratelimitByIpAddress(req.ip);
	if (!success) {
		return NextResponse.json({ error: "Rate limited" }, { status: 429 });
	}

	const geo = geolocation(req);

	const headersList = headers();
	const continent = headersList.get("x-vercel-ip-continent");
	console.log("headers", continent);

	return NextResponse.json({ ...geo, continent });
}
