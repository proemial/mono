"use client";

import { Button, Icons } from "@proemial/shadcn-ui";
import { useState } from "react";

export function ButtonThumbsUp() {
	const [thumbsUp, setThumbsUp] = useState(false);

	const handleClick = () => {
		setThumbsUp(!thumbsUp);
	};

	return (
		<Button size="actionBar" variant="ghost" onClick={() => handleClick()}>
			<Icons.thumbsUp
				className={`${
					thumbsUp
						? "fill-foreground stroke-background"
						: "fill-background stroke-foreground"
				}`}
			/>
		</Button>
	);
}
