"use client";

import { Button } from "@proemial/shadcn-ui";
import { Share } from "lucide-react";

export function ButtonShare() {
	const handleClick = () => {
		// Share
	};

	return (
		<Button size="actionBar" variant="ghost" onClick={() => handleClick()}>
			<Share />
		</Button>
	);
}
