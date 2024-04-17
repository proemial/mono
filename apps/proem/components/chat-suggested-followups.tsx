"use client";

import { Suggestions, SuggestionsProps } from "@/components/suggestions";
import { Header4 } from "@proemial/shadcn-ui";
import { useChat } from "ai/react";
import { GanttChart } from "./icons/GanttChart";
import { SelectContentSelector } from "./select-content-selector";

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
							{ value: "trending", label: "Trending", disabled: true },
							{ value: "curious", label: "Curious", disabled: true },
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
