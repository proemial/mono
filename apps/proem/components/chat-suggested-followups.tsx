"use client";

import { Suggestions, SuggestionsProps } from "@/components/suggestions";
import { Header4 } from "@proemial/shadcn-ui";
import { useChat } from "ai/react";
import { SelectContentSelector } from "./select-content-selector";
import { GanttChart } from "./icons/GanttChart";

type ChatSuggestedFollowupsProps = Pick<SuggestionsProps, "suggestions"> & {
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
					<Header4>Suggested follow-ups</Header4>
				</div>
				<div>
					<SelectContentSelector
						selector={[
							{ value: "popular", label: "Popular" },
							{ value: "trending", label: "Trending" },
							{ value: "curious", label: "Curious" },
						]}
					/>
				</div>
			</div>
			<div>
				<Suggestions suggestions={suggestions} onClick={onClick} />
			</div>
		</div>
	);
}
