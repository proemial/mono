import { NextResponse } from "next/server";

export const revalidate = 0;

export async function POST(request: Request) {
	const text = await request.text();
	const data = JSON.parse(text) as {
		id: string;
		payload: unknown;
	};

	console.log("/slack/broker/out");
	console.log(JSON.stringify(data));

	const result = await fetch(
		"https://hooks.slack.com/services/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",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data.payload),
		},
	);

	return NextResponse.json({ body: data, result });
}
