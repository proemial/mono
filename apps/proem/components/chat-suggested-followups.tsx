"use client";

import { Suggestions, SuggestionsProps } from "@/components/suggestions";
import { Header4 } from "@proemial/shadcn-ui";
import { useChat } from "ai/react";
import { GanttChart } from "./icons/GanttChart";
import { MoodSelector } from "./mood-selector";

export type ChatSuggestedFollowupsProps = Pick<
	SuggestionsProps,
	"suggestions"
> & {
	onClick?: ReturnType<typeof useChat>["append"];
	trackingPrefix: string;
};

export function ChatSuggestedFollowups({
	suggestions,
	onClick,
	trackingPrefix,
}: ChatSuggestedFollowupsProps) {
	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center place-content-between">
				<div className="flex items-center gap-3.5">
					<GanttChart />
					<Header4>Suggested questions</Header4>
				</div>
				<div className="-mr-2">
					<MoodSelector trackingPrefix={trackingPrefix} />
				</div>
			</div>
			<div>
				<Suggestions
					suggestions={suggestions}
					trackingPrefix={trackingPrefix}
					onClick={onClick}
					starters={trackingPrefix === "read"}
				/>
			</div>
		</div>
	);
}
