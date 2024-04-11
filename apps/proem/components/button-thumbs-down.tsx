"use client";

import { Button, Icons } from "@proemial/shadcn-ui";
import { useState } from "react";

export function ButtonThumbsDown() {
	const [thumbsDown, setThumbsDown] = useState(false);

	const handleClick = () => {
		setThumbsDown(!thumbsDown);
	};

	return (
		<Button size="actionBar" variant="ghost" onClick={() => handleClick()}>
			<Icons.thumbsDown
				className={`${
					thumbsDown
						? "fill-foreground stroke-background"
						: "fill-background stroke-foreground"
				}`}
			/>
		</Button>
	);
}
