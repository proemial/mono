"use client";
import { fetchQuestionsForCurrentUser } from "@/app/profile/profile-actions";
import { CollapsibleSection } from "@/components/collapsible-section";
import { DrawerClose, Header4 } from "@proemial/shadcn-ui";
import Link from "next/link";
import { useQuery } from "react-query";
export const USER_QUESTIONS_QUERY_KEY = "user-questions";

export function ProfileQuestions() {
	const { error, data } = useQuery({
		queryKey: [USER_QUESTIONS_QUERY_KEY],
		queryFn: () => fetchQuestionsForCurrentUser(),
	});

	if (error) {
		return null;
	}

	if (data?.length === 0) {
		return null;
	}

	return (
		<CollapsibleSection
			trigger={<Header4>Question</Header4>}
			extra={data?.length}
		>
			{data?.map((question) => (
				<div key={question.id}>
					<DrawerClose asChild>
						<Link href={`/answer/${question.slug}`}>
							<div className="truncate w-full pr-20">{question.question}</div>
						</Link>
					</DrawerClose>
				</div>
			))}
		</CollapsibleSection>
	);
}
