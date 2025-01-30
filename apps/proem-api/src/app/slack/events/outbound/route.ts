import { NextResponse } from "next/server";
import { getTarget } from "../../utils/routing";

export const revalidate = 0;

export async function POST(request: Request) {
	try {
		const text = await request.text();
		const data = JSON.parse(text) as {
			metadata: {
				appId: string;
				eventId: string;
			};
			payload: unknown;
		};

		if (!data?.metadata?.eventId || !data?.payload) {
			return NextResponse.json(
				{ error: "Invalid request, missing metadata.eventId or payload" },
				{ status: 400 },
			);
		}

		console.log("/slack/events/outbound");
		console.log(JSON.stringify(data));

		const target = await getTarget(data);
		console.log(target);

		const result = await fetch(target.url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				...target.headers,
			},
			body: JSON.stringify({ ...target.body, ...data.payload }),
		});

		return NextResponse.json({ body: data, result });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: JSON.stringify(error) }, { status: 500 });
	}
}
