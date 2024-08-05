"use client";

import { OpenAlexTopic } from "@proemial/repositories/oa/models/oa-paper";
import { useMemo } from "react";
import { getFieldFromOpenAlexTopics } from "./get-field-from-open-alex-topics";

export function FeedItemField({ topics = [] }: { topics?: OpenAlexTopic[] }) {
	const field = useMemo(() => getFieldFromOpenAlexTopics(topics), [topics]);

	if (!field) {
		return null;
	}

	return (
		<div className="flex items-center gap-2">
			{field.icon}
			<div className="text-2xs  uppercase line-clamp-1">
				{field.displayName}
			</div>
		</div>
	);
}
