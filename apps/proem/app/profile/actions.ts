"use server";

import { ratelimitByIpAddress } from "@/utils/ratelimiter";
import { auth } from "@clerk/nextjs/server";
import { neonDb } from "@proemial/data";
import { collections } from "@proemial/data/neon/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export const getCollections = async (userId: string) => {
	// Auth
	const authenticatedUser = auth();
	if (!authenticatedUser || authenticatedUser.userId !== userId) {
		throw new Error("Unauthorized");
	}
	// Rate limit
	const ip = headers().get("x-forwarded-for") ?? headers().get("x-real-ip");
	const { success } = await ratelimitByIpAddress(ip);
	if (!success) {
		throw new Error("Rate limit exceeded");
	}

	return neonDb.query.collections.findMany({
		where: eq(collections.ownerId, userId),
	});
};
