import { type ApiData, verifyAccess } from "@vercel/flags";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const access = await verifyAccess(request.headers.get("Authorization"));
	if (!access) return NextResponse.json(null, { status: 401 });

	return NextResponse.json<ApiData>({
		definitions: {
			showAIAssistant: {
				description: "Controls whether the AI assistant is visible",
				options: [
					{ value: false, label: "Old ASK endpoint" },
					{ value: true, label: "Single AI Assistant on all pages" },
				],
			},
			debug: {
				description: "Enables debugging features",
				options: [
					{ value: [true, false], label: "Enable debugging" },
					{
						value: [true, true],
						label: "Enable debugging and disable feed cache",
					},
				],
			},
		},
	});
}
