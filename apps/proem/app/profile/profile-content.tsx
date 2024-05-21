import { answers } from "@/app/api/bot/answer-engine/answers";
import { fetchQuestionsForCurrentUser } from "@/app/profile/profile-actions";
import { ProfileYou } from "@/app/profile/profile-you";
import { CollapsibleSection } from "@/components/collapsible-section";
import { Header4 } from "@proemial/shadcn-ui";
import { use } from "react";
import { useQuery } from "react-query";

export function ProfileContent() {
	console.log("profile content");
	// const questions = use(fetchQuestionsForCurrentUser());
	const { error, data } = useQuery({
		// queryKey: ["questions"],
		queryFn: () => fetchQuestionsForCurrentUser(),
	});

	console.log(error);
	console.log(data);

	return (
		<div className="px-4 space-y-4">
			<ProfileYou />
			{/* <ListiList title="Questions" content={{}} /> */}
			{/* <ProfileQuestions /> */}
			<CollapsibleSection trigger={<Header4>Question</Header4>} extra={2}>
				{data?.map((question) => (
					<div key={question.id}>
						{question.id}
						<div>{question.question}</div>
						<div>{question.slug}</div>
					</div>
				))}
			</CollapsibleSection>
		</div>
	);
}
