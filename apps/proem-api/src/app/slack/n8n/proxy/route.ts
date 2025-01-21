import { NextResponse } from "next/server";

export const revalidate = 0;

export async function POST(request: Request) {
	const text = await request.text();
	const body = text?.startsWith("payload=")
		? decodeURIComponent(text.slice(8))
		: text;
	console.log(body);

	const result = await fetch(
		"https://proem.app.n8n.cloud/webhook/51715013-5cfe-4d24-bf80-51e3d2dbe18c/webhook",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body,
		},
	);
	console.log(result);

	return NextResponse.json({ body, result });
}
