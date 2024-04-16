"use client";

import { Button } from "@proemial/shadcn-ui";
import { useChat } from "ai/react";
import { useRouter } from "next/navigation";

export type SuggestionsProps = {
	suggestions?: string[];
	onClick?: ReturnType<typeof useChat>["append"];
};

export function Suggestions({ suggestions, onClick }: SuggestionsProps) {
	const router = useRouter();

	function handleClick(suggestion: string) {
		if (onClick) {
			onClick({ role: "user", content: suggestion });
		} else {
			router.push(`/answer/${encodeURIComponent(suggestion)}`);
		}
	}

	return (
		<div className="flex flex-col gap-5">
			<div className="flex flex-col gap-2">
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
