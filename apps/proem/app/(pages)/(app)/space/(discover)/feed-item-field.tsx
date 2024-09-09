"use client";

import { OpenAlexTopic } from "@proemial/repositories/oa/models/oa-paper";
import { useMemo } from "react";
import { getFieldFromOpenAlexTopics } from "./get-field-from-open-alex-topics";
import { useSearchParams } from "next/navigation";

export function FeedItemField({ topics = [] }: { topics?: OpenAlexTopic[] }) {
	const field = useMemo(() => getFieldFromOpenAlexTopics(topics), [topics]);
	const searchParams = useSearchParams();

	const highlight = searchParams.get("foreground") ?? searchParams.get("c1");

	const style = highlight
		? {
				backgroundColor: `#${highlight}`,
				color: "white",
				padding: "4px 14px",
				borderRadius: "16px",
				display: "flex",
				alignItems: "center",
				marginBottom: "16px",
			}
		: {};

	if (!field) {
		return null;
	}

	return (
		<div className="flex items-center gap-2" style={style}>
			{field.icon}
			<div className="text-2xs  uppercase line-clamp-1">
				{field.displayName}
			</div>
		</div>
	);
}
