"use client";
import { fetchQuestionsForCurrentUser } from "@/app/profile/profile-actions";
import { CollapsibleSection } from "@/components/collapsible-section";
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
			<div className="max-h-[200px] overflow-y-auto">
				{data?.map((question) => (
					<div key={question.id}>
						<DrawerClose asChild>
							<Link href={`/answer/${question.slug}`}>
								<div className="truncate w-full pr-20 text-sm py-0.5">
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
