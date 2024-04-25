"use client";

import { Suggestions, SuggestionsProps } from "@/components/suggestions";
import { Header4 } from "@proemial/shadcn-ui";
import { useChat } from "ai/react";
import { FakeMoodSelector } from "./fake-mood-selector";
import { GanttChart } from "./icons/GanttChart";

export type ChatSuggestedFollowupsProps = Pick<
	SuggestionsProps,
	"suggestions"
> & {
	onClick?: ReturnType<typeof useChat>["append"];
};

export function ChatSuggestedFollowups({
	suggestions,
	onClick,
}: ChatSuggestedFollowupsProps) {
	return (
		<div className="flex flex-col gap-5">
			<div className="flex items-center place-content-between">
				<div className="flex items-center gap-4">
					<GanttChart />
					<Header4>Suggested questions</Header4>
				</div>
				<div className="-mr-2">
					<FakeMoodSelector />
				</div>
			</div>
			<div>
				<Suggestions suggestions={suggestions} onClick={onClick} />
			</div>
		</div>
	);
}
