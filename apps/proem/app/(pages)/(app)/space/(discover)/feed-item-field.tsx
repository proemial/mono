"use client";

import { oaFieldIconMap } from "@/app/data/oa-fields";
import { OpenAlexTopic } from "@proemial/repositories/oa/models/oa-paper";
import { useMemo } from "react";

export function FeedItemField({ topics }: { topics?: OpenAlexTopic[] }) {
	const fields =
		topics?.map((topic) => ({
			id: topic.field.id,
			score: topic.score,
		})) ?? [];

	const field = useMemo(() => {
		if (fields.length === 0) {
			return undefined;
		}
		const field = fields.reduce((prev, current) =>
			prev.score > current.score ? prev : current,
		);
		return oaFieldIconMap[field.id];
	}, [fields]);

	if (field) {
		return (
			<div className="flex items-center gap-2">
				{field.icon}
				<div className="text-xs uppercase line-clamp-1">
					{field.displayName}
				</div>
			</div>
		);
	}

	return undefined;
}
