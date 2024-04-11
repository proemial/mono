import { geolocation } from "@vercel/edge";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: Request) {
	const geo = geolocation(request);

	const headersList = headers();
	const continent = headersList.get("x-vercel-ip-continent");
	console.log("headers", continent);

	return NextResponse.json({ ...geo, continent });
}
