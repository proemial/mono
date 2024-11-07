"use client";
import { GanttChart } from "@/components/icons/GanttChart";
import { MoodSelector } from "./mood-selector";
import { Suggestions, SuggestionsProps } from "@/components/suggestions";
import { Header4 } from "@proemial/shadcn-ui";
import { useChat } from "ai/react";

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
	const handleOnClick = (input: string) => {
		onClick?.({ role: "user", content: input });
	};

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center place-content-between">
				<div className="flex items-center gap-3.5">
					<GanttChart />
					<Header4 className="pb-2">Suggested questions</Header4>
				</div>
				<div className="-mr-2">
					<MoodSelector trackingPrefix={trackingPrefix} />
				</div>
			</div>
			<div>
				<Suggestions
					suggestions={suggestions}
					onClick={handleOnClick}
					type={trackingPrefix === "read" ? "starter" : "followup"}
				/>
			</div>
		</div>
	);
}
