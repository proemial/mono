"use client";

import { Button } from "@proemial/shadcn-ui";
import { useRouter } from "next/navigation";

export type SuggestionsProps = { suggestions?: string[] };

export function Suggestions({ suggestions }: SuggestionsProps) {
	const router = useRouter();

	function onClick(suggestion: string) {
		router.push(`/answer/${encodeURIComponent(suggestion)}`);
	}

	return (
		<div className="flex flex-col gap-5 pb-4">
			<div className="flex flex-col gap-2">
				{suggestions?.map((suggestion) => (
					<Button
						variant="suggestion"
						size="suggestion"
						key={suggestion}
						onClick={() => onClick(suggestion)}
					>
						{suggestion}
					</Button>
				))}
			</div>
			<div className="flex justify-center">
				<Button size="pill">More</Button>
			</div>
		</div>
	);
}
