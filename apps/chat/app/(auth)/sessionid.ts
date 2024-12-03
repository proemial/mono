import { cookies } from "next/headers";
import { uuid5 } from "@proemial/utils/uuid";

export async function getSessionId() {
	const cookieStore = await cookies();
	const cookie =
		cookieStore.getAll().find((c) => c.name.startsWith("ph_phc_"))?.value ?? "";
	const parsed = cookie ? JSON.parse(decodeURIComponent(cookie)) : undefined;

	return uuid5(parsed?.distinct_id ?? "", "chat");
}
