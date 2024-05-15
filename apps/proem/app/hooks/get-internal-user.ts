import { cookies } from "next/headers";

export function getInternalUser(email?: string): {
	isInternal: boolean;
	proemialName?: string;
	proemialEmail?: string;
} {
	const mail = email ?? getInternalEmailFromCookie();

	const [name, domain] = mail?.split("@") ?? [];
	if (domain?.endsWith("proemial.ai") && name) {
		return {
			isInternal: true as const,
			proemialName: name as string,
			proemialEmail: mail,
		};
	}

	return { isInternal: false as const };
}

function getInternalEmailFromCookie() {
	const cookie = cookies().get("internalUser");
	const internalUser = cookie?.value;
	if (internalUser) {
		return JSON.parse(internalUser).email;
	}

	return null;
}
