import { ChatInput } from "@/app/components/chat/chat-input";
import { ChatMessages } from "@/app/components/chat/chat-messages-ask";
import { ProemLogo } from "@/app/components/icons/brand/logo";
import { PageLayout } from "../page-layout";
import { Starters } from "./chat/starters";

const target = "ask";

type Props = {
	params: { q: string };
};

export default async function AskPage({ params }: Props) {
	return (
		<PageLayout title={target}>
			<div className="mx-[-16px]">
				<ChatMessages message={params.q}>
					<Text />
				</ChatMessages>
			</div>

			<div className="flex flex-col px-2 pt-1 pb-2">
				<ChatInput target={target}>
					<Starters target={target} />
				</ChatInput>
			</div>
		</PageLayout>
	);
}

function Text() {
	return (
		<div className="pt-8">
			<ProemLogo includeName />
			<div className="pt-6 text-center text-md text-white/80">
				<div>answers to your questions</div>
				<div>supported by scientific research</div>
			</div>
		</div>
	);
}

// import Chat from "@/app/(pages)/(app)/(answer-engine)/chat/ask-chat";
// import { getProfileFromUser } from "@/app/(pages)/(app)/profile/profile-from-user";
// import { currentUser } from "@clerk/nextjs";

// export const revalidate = 1;

// export const metadata = {
// 	title: "proem - science answers",
// };

// type Props = {
// 	searchParams: { q: string };
// };

// export default async function FrontPage({ searchParams }: Props) {
// 	const user = await currentUser();
// 	const userProfile = getProfileFromUser(user);

// 	return (
// 		<Chat
// 			user={
// 				user && userProfile
// 					? {
// 							name: userProfile.fullName,
// 							initials: userProfile.initials,
// 							email: userProfile.email,
// 							avatar: user.imageUrl,
// 							id: user.id,
// 					  }
// 					: undefined
// 			}
// 			message={searchParams.q}
// 		/>
// 	);
// }
