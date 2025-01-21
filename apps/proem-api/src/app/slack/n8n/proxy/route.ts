import { NextResponse } from "next/server";

export const revalidate = 0;

export async function POST(request: Request) {
	const text = await request.text();
	const unencoded = text?.startsWith("payload=")
		? decodeURIComponent(text.slice(8))
		: text;

	const body = JSON.parse(unencoded);
	console.log(body);

	if (body.type === "block_actions") {
		console.log("block_actions");
		const result = await fetch(
			"https://proem.app.n8n.cloud/webhook/99b44999-b7f8-499b-87f2-645063bbfd99",
			// "https://proem.app.n8n.cloud/webhook-test/99b44999-b7f8-499b-87f2-645063bbfd99",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body),
			},
		);
		console.log(result);

		return NextResponse.json({ body, result });
	}

	const result = await fetch(
		"https://proem.app.n8n.cloud/webhook/51715013-5cfe-4d24-bf80-51e3d2dbe18c/webhook",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		},
	);
	console.log(result);

	return NextResponse.json(body, {
		status: result.status,
		statusText: result.statusText,
	});
}
