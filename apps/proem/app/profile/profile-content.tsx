import { answers } from "@/app/api/bot/answer-engine/answers";
import { fetchQuestionsForCurrentUser } from "@/app/profile/profile-actions";
import { ProfileQuestions } from "@/app/profile/profile-questions";
import { ProfileYou } from "@/app/profile/profile-you";
import { CollapsibleSection } from "@/components/collapsible-section";
import { useUser } from "@clerk/nextjs";
import { Header4 } from "@proemial/shadcn-ui";
import { use } from "react";
import { useQuery } from "react-query";

export function ProfileContent() {
	const user = useUser();
	return (
		<div className="px-4 space-y-4">
			<ProfileYou />
			{user.isSignedIn && <ProfileQuestions />}
		</div>
	);
}
