import { cookies } from "next/headers";

export async function idFromCookie() {
	try {
		const internalUserId = await getInternalUserId();
		if (internalUserId) {
			return { id: internalUserId, internal: true };
		}

		const posthogDistinctId = await getPsothogDistinctId();
		if (posthogDistinctId) {
			return { id: posthogDistinctId };
		}
	} catch (error) {
		// console.error("Error getting user id", error);
	}

	return undefined;
}

async function getInternalUserId() {
	const cookie = (await cookies()).get("internalUser")?.value ?? "";
	const parsed = cookie ? JSON.parse(decodeURIComponent(cookie)) : undefined;

	return parsed?.email ?? parsed?.userId;
}

async function getPsothogDistinctId() {
	const cookie =
		(await cookies()).getAll().find((c) => c.name.startsWith("ph_phc_"))
			?.value ?? "";
	const parsed = cookie ? JSON.parse(decodeURIComponent(cookie)) : undefined;

	return parsed?.distinct_id;
}
