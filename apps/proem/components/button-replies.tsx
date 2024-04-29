"use client";
import { Button } from "@proemial/shadcn-ui";
import { MessageSquare01 } from "@untitled-ui/icons-react";

export function ButtonReplies() {
	return (
		<Button size="actionBar" variant="ghost">
			<MessageSquare01 />
		</Button>
	);
}
