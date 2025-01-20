import { NextResponse } from "next/server";

export async function POST(request: Request) {
	const body = await request.json();
	const url = request.url;

	console.log(url);
	console.log(body);

	return NextResponse.json({ url, body });
}
