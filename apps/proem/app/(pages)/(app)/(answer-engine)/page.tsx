import Chat from "@/app/(pages)/(app)/(answer-engine)/chat/ask-chat";
import { getProfileFromUser } from "@/app/(pages)/(app)/profile/profile-from-user";
import { currentUser } from "@clerk/nextjs";

export const revalidate = 1;

export const metadata = {
	title: "proem - science answers",
};

type Props = {
	searchParams: { q: string };
};

export default async function FrontPage({ searchParams }: Props) {
	const user = await currentUser();
	const userProfile = getProfileFromUser(user);

	return (
		<Chat
			user={
				user && userProfile
					? {
							name: userProfile.fullName,
							initials: userProfile.initials,
							email: userProfile.email,
							avatar: user.imageUrl,
							id: user.id,
					  }
					: undefined
			}
			message={searchParams.q}
		/>
	);
}
