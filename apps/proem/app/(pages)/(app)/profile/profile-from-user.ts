import { currentUser } from "@clerk/nextjs";

export type User =
	| {
			firstName: string | null;
			lastName: string | null;
			primaryEmailAddressId: string | null;
			emailAddresses: { id: string; emailAddress: string }[];
			imageUrl: string;
	  }
	| null
	| undefined;

export function getProfileFromUser(user: User) {
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
	};
}
