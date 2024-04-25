"use client";

import { analyticsKeys, trackHandler } from "@/app/components/analytics/tracking/tracking-keys";
import { Button } from "@proemial/shadcn-ui";
import { useChat } from "ai/react";
import { useRouter } from "next/navigation";

export type SuggestionsProps = {
	suggestions?: string[];
	onClick?: ReturnType<typeof useChat>["append"];
	starters?: boolean;
};

export function Suggestions({ suggestions, onClick, starters }: SuggestionsProps) {
	const router = useRouter();

	const handleTracking = () => {
		trackHandler(analyticsKeys.ask.click.suggestion)();
		if (starters) {
			trackHandler(analyticsKeys.ask.click.starter)();
		} else {
			trackHandler(analyticsKeys.ask.click.followup)();
		}
	}

	function handleClick(suggestion: string) {
		handleTracking();
		if (onClick) {
			onClick({ role: "user", content: suggestion });
		} else {
			router.push(`/answer/${encodeURIComponent(suggestion)}`);
		}
	}

	return (
		<div className="flex flex-col gap-5">
			<div className="flex flex-col gap-4">
				{suggestions?.map((suggestion) => (
					<Button
						variant="suggestion"
						size="suggestion"
						key={suggestion}
						onClick={() => handleClick(suggestion)}
					>
						{suggestion}
					</Button>
				))}
			</div>
			{/* <div className="flex justify-center">
				<Button size="pill">More</Button>
			</div> */}
		</div>
	);
}
