"use client";

import { OpenAlexTopic } from "@proemial/repositories/oa/models/oa-paper";
import { createElement, useMemo } from "react";
import { getFieldFromOpenAlexTopics } from "./get-field-from-open-alex-topics";
import { useSearchParams } from "next/navigation";

export function FeedItemField({ topics = [] }: { topics?: OpenAlexTopic[] }) {
	const field = useMemo(() => getFieldFromOpenAlexTopics(topics), [topics]);
	const searchParams = useSearchParams();

	const breakPoint = 300;
	const embedColor = searchParams.get("foreground");
	const wideEmbedStyle = embedColor
		? {
				backgroundColor: `#${embedColor}`,
				color: "white",
				padding: "4px 14px",
				borderRadius: "16px",
				display: "flex",
				alignItems: "center",
			}
		: {};
	const narrowEmbedStyle =
		embedColor && `!text-[#${embedColor}] !stroke-[1.5px]`;

	if (!field) {
		return null;
	}

	return (
		<>
			{createElement(field.icon.type, {
				...field.icon.props,
				className: `block min-[${breakPoint}px]:hidden ${narrowEmbedStyle}`,
			})}
			<div className={`max-[${breakPoint}px]:hidden`}>
				<div className="flex items-center gap-2" style={wideEmbedStyle}>
					{field.icon}
					<div className="text-2xs  uppercase line-clamp-1">
						{field.displayName}
					</div>
				</div>
			</div>
		</>
	);
}
