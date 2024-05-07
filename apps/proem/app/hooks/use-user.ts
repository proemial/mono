import { useUser as useClerkUser } from "@clerk/nextjs";
import { getProfileFromClerkUser } from "@proemial/models/clerk-user";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";

export const INTERNAL_COOKIE_NAME = "internalUser";

export type User = {
	fullName: string;
	initials: string;
	email: string;
	avatar: string;
	id?: string;
	isInternal?: boolean;
	proemialName?: string;
};

export function useExperimental(...email: string[]) {
	const [internal, setInternal] = useState(false);
	const { user } = useUser();

	useEffect(() => {
		if (!email.length) setInternal(!!user?.isInternal);
		else setInternal(!!user && email.includes(user.email));
	}, [user, email]);

	return internal;
}

export function useUser() {
	const { user: clerkUser, isLoaded } = useClerkUser();

	const clerkProfile = getProfileFromClerkUser(clerkUser);
	const internalUser = getInternalUser(clerkProfile?.email);

	if (!clerkProfile?.id && !internalUser.isInternal) {
		return { user: undefined, isLoaded };
	}

	const user = {
		...clerkProfile,
		isInternal: internalUser.isInternal,
		proemialName: internalUser.proemialEmail,
	} as User;

	if (!user.email && internalUser.proemialEmail) {
		user.email = internalUser.proemialEmail;
	}

	return { user: user, isLoaded };
}

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

export function getInternalEmailFromCookie() {
	const internalUser = getCookie(INTERNAL_COOKIE_NAME)?.toString();
	if (internalUser) {
		return JSON.parse(internalUser).email;
	}

	return null;
}
