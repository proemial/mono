"use client";

import { Button } from "@proemial/shadcn-ui";
import { Compass } from "lucide-react";

export function ButtonCompass({ handleClick }: { handleClick: () => void }) {
	return (
		<Button variant="ghost" size="actionBar" onClick={() => handleClick()}>
			<Compass className="size-4" />
		</Button>
	);
}
