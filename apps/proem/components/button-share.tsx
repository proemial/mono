"use client";

import { Button } from "@proemial/shadcn-ui";
import { Upload01 } from "@untitled-ui/icons-react";

export function ButtonShare() {
	const handleClick = () => {
		// Share
	};

	return (
		<Button size="actionBar" variant="ghost" onClick={() => handleClick()}>
			<Upload01 />
		</Button>
	);
}
