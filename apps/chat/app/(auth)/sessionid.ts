import { cookies } from "next/headers";

export async function getSessionId() {
	const cookieStore = await cookies();
	const cookie =
		cookieStore.getAll().find((c) => c.name.startsWith("ph_phc_"))?.value ?? "";
	const parsed = cookie ? JSON.parse(decodeURIComponent(cookie)) : undefined;

	return parsed?.distinct_id;
}
