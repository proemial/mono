import { ratelimitByIpAddress } from "@/utils/ratelimiter";
import { NextRequest, NextResponse } from "next/server";
import { ModelInfrastructureClient } from "../model-infrastructure-client";
import { z } from "zod";

export const maxDuration = 60;

const RequestBodySchema = z.object({
	endpointName: z.string(),
	endpointConfigName: z.string(),
});

export const POST = async (req: NextRequest) => {
	try {
		const { success } = await ratelimitByIpAddress(req.ip);
		if (!success) {
			return NextResponse.json({ error: "Rate limited" }, { status: 429 });
		}
		try {
			const { endpointName, endpointConfigName } = RequestBodySchema.parse(
				await req.json(),
			);
			const response = await ModelInfrastructureClient.start({
				endpointName,
				endpointConfigName,
			});
			return NextResponse.json({
				message: "Model started",
				endpointArn: response.EndpointArn,
			});
		} catch (error) {
			console.error(error);
			return NextResponse.json(error, { status: 400 });
		}
	} catch (e) {
		console.error(e);
		return NextResponse.json(e, { status: 500 });
	}
};
