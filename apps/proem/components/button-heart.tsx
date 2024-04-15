"use client";

import { Button } from "@proemial/shadcn-ui";
import { Heart } from "lucide-react";
import { useState } from "react";

export function ButtonHeart({ small }: { small?: boolean }) {
	const [hearted, setHearted] = useState(false);

	const handleClick = () => {
		setHearted(!hearted);
	};

	return (
		<Button size="actionBar" variant="ghost" onClick={() => handleClick()}>
			<Heart
				className={`${hearted ? "fill-foreground" : "fill-background"} ${
					small ? "size-3" : ""
				}`}
			/>
		</Button>
	);
}
