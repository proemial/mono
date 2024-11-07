"use client";
import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import { routes } from "@/routes";
import { Button } from "@proemial/shadcn-ui";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";

export type SuggestionsProps = {
	suggestions: string[];
	onClick?: (input: string) => void;
	type: "starter" | "generated" | "followup"; // `starter` means the static, hand-picked starters
};

export function Suggestions({ suggestions, onClick, type }: SuggestionsProps) {
	const router = useRouter();

	const handleTracking = () => {
		switch (type) {
			case "starter":
				trackHandler(analyticsKeys.assistant.ask.suggestion.starter)();
				break;
			case "generated":
				trackHandler(analyticsKeys.assistant.ask.suggestion.generated)();
				break;
			case "followup":
				trackHandler(analyticsKeys.assistant.ask.suggestion.followUp)();
				break;
		}
	};

	const handleClick =
		(suggestion: string) => (event: MouseEvent<HTMLButtonElement>) => {
			handleTracking();
			if (onClick) {
				onClick(suggestion);
			} else {
				router.push(`${routes.answer}/?q=${encodeURIComponent(suggestion)}`);
			}
		};

	return (
		<div className="space-y-2 w-full">
			{suggestions?.map((suggestion) => (
				<Button
					variant="suggestion"
					size="suggestion"
					key={suggestion}
					className="active:ring-1 ring-foreground select-none px-3 bg-theme-700 text-white"
					onClick={handleClick(suggestion)}
				>
					{suggestion}
				</Button>
			))}
		</div>
	);
}
