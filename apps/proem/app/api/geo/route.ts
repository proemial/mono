import { geolocation } from "@vercel/edge";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: Request) {
	const geo = geolocation(request);

	return NextResponse.json(geo);
}
