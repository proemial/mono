import { type ApiData, verifyAccess } from "@vercel/flags";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const access = await verifyAccess(request.headers.get("Authorization"));
	if (!access) return NextResponse.json(null, { status: 401 });

	return NextResponse.json<ApiData>({
		definitions: {
			feedSettings: {
				description: "Controls the feed settings for Discover",
				options: [
					{
						value: { showInstitutions: true },
						label: "Show institutions in feed",
					},
					{
						value: { showInstitutions: false },
						label: "Hide institutions in feed",
					},
				],
			},
			debug: {
				description: "Enables debugging features",
				options: [
					{ value: [true, false], label: "Enable debugging" },
					{
						value: [true, true],
						label: "Enable debugging and disable feed cache (CAREFULL!)",
					},
				],
			},
		},
	});
}
