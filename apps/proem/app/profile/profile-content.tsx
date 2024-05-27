import { ProfileQuestions } from "@/app/profile/profile-questions";
import { ProfileYou } from "@/app/profile/profile-you";
import { useUser } from "@clerk/nextjs";

export function ProfileContent() {
	const user = useUser();

	return (
		<div className="px-4 space-y-4">
			<ProfileYou />

			{user.isSignedIn && <ProfileQuestions />}
		</div>
	);
}
