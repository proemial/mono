export function isInternalUser(email?: string) {
	const [name, domain] = email?.split("@") ?? [];
	if (domain?.endsWith("proemial.ai") && name) {
		return { isInternal: true as const, name };
	}

	return { isInternal: false as const, name: null };
}
