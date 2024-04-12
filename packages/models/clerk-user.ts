export type ClerkUser =
	| {
			firstName: string | null;
			lastName: string | null;
			primaryEmailAddressId: string | null;
			emailAddresses: { id: string; emailAddress: string }[];
			imageUrl: string;
			id?: string;
	  }
	| null
	| undefined;

export function getProfileFromClerkUser(user: ClerkUser) {
	if (!user) {
		return undefined;
	}

	const fullName = `${user.firstName} ${user.lastName}`;
	const initials = fullName
		.split(" ")
		.map((name) => name.charAt(0))
		.join("");

	const email =
		user.emailAddresses.find((email) => email.id === user.primaryEmailAddressId)
			?.emailAddress ?? "";

	return {
		fullName,
		initials,
		email,
		avatar: user.imageUrl,
		id: user.id,
	};
}
