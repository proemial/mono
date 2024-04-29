"use client";
import { Button } from "@proemial/shadcn-ui";
import { Bookmark } from "@untitled-ui/icons-react";
import { useState } from "react";

export function ButtonBookmark() {
	const [bookmarked, setBookmarked] = useState(false);

	const handleClick = () => {
		setBookmarked(!bookmarked);
	};

	return (
		<Button size="actionBar" variant="ghost" onClick={() => handleClick()}>
			<Bookmark
				className={`${bookmarked ? "fill-foreground" : "fill-background"}`}
			/>
		</Button>
	);
}
