"use client";
import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import { Button } from "@proemial/shadcn-ui";
import { useChat } from "ai/react";
import { useRouter } from "next/navigation";

export type SuggestionsProps = {
	suggestions?: string[];
	onClick?: ReturnType<typeof useChat>["append"];
	starters?: boolean;
	trackingPrefix: string;
};

export function Suggestions({
	suggestions,
	onClick,
	starters,
	trackingPrefix,
}: SuggestionsProps) {
	const router = useRouter();

	const handleTracking = () => {
		trackHandler(`${trackingPrefix}:${analyticsKeys.chat.click.suggestion}`)();
		if (starters) {
			trackHandler(`${trackingPrefix}:${analyticsKeys.chat.click.starter}`)();
		} else {
			trackHandler(`${trackingPrefix}:${analyticsKeys.chat.click.followup}`)();
		}
	};

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
			<div className="space-y-2.5">
				{suggestions?.map((suggestion) => (
					<Button
						variant="suggestion"
						size="suggestion"
						key={suggestion}
						className=" active:ring-1 ring-foreground select-none"
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
