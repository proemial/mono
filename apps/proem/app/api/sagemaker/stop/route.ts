import { ratelimitByIpAddress } from "@/utils/ratelimiter";
import { NextRequest, NextResponse } from "next/server";
import { ModelInfrastructureClient } from "../model-infrastructure-client";

export const maxDuration = 60;

export const POST = async (req: NextRequest) => {
	try {
		const { success } = await ratelimitByIpAddress(req.ip);
		if (!success) {
			return NextResponse.json({ error: "Rate limited" }, { status: 429 });
		}

		await ModelInfrastructureClient.stop({
			endpointName: process.env.AWS_MODEL_ENDPOINT_NAME as string,
		});

		return NextResponse.json({
			message: "Model stopped",
		});
	} catch (e) {
		console.error(e);
		return NextResponse.json(e, { status: 500 });
	}
};
