import Chat from "@/app/(pages)/(app)/(answer-engine)/chat";
import { getProfileFromUser } from "@/app/(pages)/(app)/profile/getProfileFromUser";
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
	const { fullName, initials } = getProfileFromUser(user);

	return (
		<Chat
			user={
				user
					? {
							name: fullName!,
							initials: initials!,
							avatar: user?.imageUrl,
							id: user?.id,
					  }
					: undefined
			}
			message={searchParams.q}
		/>
	);
}
