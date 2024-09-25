"use client";
import { fetchQuestionsForCurrentUser } from "@/app/profile/profile-actions";
import { CollapsibleSection } from "@/components/collapsible-section";
import { routes } from "@/routes";
import { DrawerClose, Header5 } from "@proemial/shadcn-ui";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
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
			trigger={<Header5 className="opacity-50 select-none">History</Header5>}
			extra={
				<Header5 className="opacity-50 select-none">{data?.length}</Header5>
			}
			collapsed={true}
		>
			<div className="space-y-4">
				{data?.map((question) => (
					<div key={question.id}>
						<DrawerClose asChild>
							<Link href={`${routes.answer}/${question.slug}`}>
								<div className="truncate w-full text-sm">
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
