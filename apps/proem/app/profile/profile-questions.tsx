"use client";
import { fetchQuestionsForCurrentUser } from "@/app/profile/profile-actions";
import { CollapsibleSection } from "@/components/collapsible-section";
import { routes } from "@/routes";
import { DrawerClose } from "@proemial/shadcn-ui";
import Link from "next/link";
import { useQuery } from "react-query";
export const USER_QUESTIONS_QUERY_KEY = "user-questions";

export function ProfileQuestions() {
	const { error, data } = useQuery({
		queryKey: [USER_QUESTIONS_QUERY_KEY],
		queryFn: () => fetchQuestionsForCurrentUser(),
	});

	if (error || !data || data?.length === 0) {
		return null;
	}

	return (
		<CollapsibleSection
			trigger={<div>Question history</div>}
			extra={data?.length}
			collapsed={true}
		>
			<div className="space-y-3">
				{data?.map((question) => (
					<div key={question.id}>
						<DrawerClose asChild>
							<Link href={`${routes.answer}/${question.slug}`}>
								<div className="truncate w-full text-sm pl-6">
									{question.question}
								</div>
							</Link>
						</DrawerClose>
					</div>
				))}
			</div>
		</CollapsibleSection>
	);
}
