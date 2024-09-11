import clsx from "clsx";
import React from "react";

export function applyExplainLinks(
	msg: string,
	onClick: (concept: string) => void,
	className?: string,
): React.ReactNode {
	const re = /\(\(.*?\)\)/gi;

	const asPush = (input: string) => {
		const sanitized = input.replace("((", "").replace("))", "");

		return (
			<span
				className={clsx("font-normal bg-neutral-200 cursor-pointer", className)}
				onClick={() => onClick(sanitized)}
			>
				{sanitized}
			</span>
		);
	};

	const arr = msg.replace(re, "~~$&~~").split("~~");
	return arr.map((s, i) => (
		<span key={i}>
			{s.match(re) ? <span>{s.match(re) ? asPush(s) : s}</span> : s}
		</span>
	));
}
