"use client";

import { Button } from "@proemial/shadcn-ui";
import { MessageSquare } from "lucide-react";

export function ButtonReplies() {
	return (
		<Button size="actionBar" variant="ghost">
			<MessageSquare />
		</Button>
	);
}
