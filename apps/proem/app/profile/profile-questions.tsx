"use client";
import { fetchQuestionsForCurrentUser } from "@/app/profile/profile-actions";
import { CollapsibleSection } from "@/components/collapsible-section";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
	Header4,
	Table,
	TableBody,
	TableCell,
	TableRow,
} from "@proemial/shadcn-ui";
import { ChevronDown, ChevronUp } from "@untitled-ui/icons-react";
import Link from "next/link";
import * as React from "react";
import { useQuery } from "react-query";

export function ProfileQuestions() {
	const { error, data } = useQuery({
		// queryKey: ["questions"],
		queryFn: () => fetchQuestionsForCurrentUser(),
	});
	console.log(data);
	if (!data || error) {
		return null;
	}

	return (
		<CollapsibleSection
			trigger={<Header4>Question</Header4>}
			extra={data?.length}
		>
			{data?.map((question) => (
				<div key={question.id}>
					<Link href={`/answer/${question.slug}`}>{question.question}</Link>
				</div>
			))}
		</CollapsibleSection>
	);
}
