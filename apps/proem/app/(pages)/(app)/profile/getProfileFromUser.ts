import { currentUser } from "@clerk/nextjs";

export function getProfileFromUser(
	user: Awaited<ReturnType<typeof currentUser>>,
) {
	if (!user) {
		return null;
	}

	const fullName = `${user.firstName} ${user.lastName}`;
	const initials = fullName
		.split(" ")
		.map((name) => name.charAt(0))
		.join("");

	const email = user.emailAddresses.find(
		(email) => email.id === user.primaryEmailAddressId,
	)?.emailAddress!;

	return {
		fullName,
		initials,
		email,
	};
}
