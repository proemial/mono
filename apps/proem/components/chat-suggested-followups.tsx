"use client";

import { Suggestions } from "@/components/suggestions";
import { Header4 } from "@proemial/shadcn-ui";
import { GanttChart } from "lucide-react";
import { SelectContentSelector } from "./select-content-selector";

export function ChatSuggestedFollowups({ label }: { label: string }) {
	function onClick() {
		console.log("Ask follow-up...");
	}

	const suggestions = [
		"What is the purpose of the Statistical Interpretation of quantum theory?",
		"What is the implication of Bell’s theorem on hidden-variable theories that reproduce quantum mechanics exactly?",
		"How does the Statistical Interpretation propose to view the quantum state description?",
	];

	return (
		<div className="flex flex-col gap-5 mb-8">
			<div className="flex items-center place-content-between">
				<div className="flex items-center gap-4">
					<GanttChart className="size-4" />
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
				<Suggestions suggestions={suggestions} />
			</div>
		</div>
	);
}
