import { Tracker } from "@/components/analytics/tracking/tracker";
import { useIsActive } from "@/app/components/menu/helpers/is-active";
import { useLinkProps } from "@/app/components/menu/helpers/link-props";
import Link from "next/link";
import React, { ReactNode } from "react";

type Props = {
	text: string;
	href: string;
	children: ReactNode;
	authRequired?: boolean;
	track?: string;
};

export function MenuItem(props: Props) {
	const { text, linkProps, children, style, active, track } =
		useMenuProps(props);

	const handleClick = () => {
		track && Tracker.track(track);
	};

	return (
		<Link {...linkProps} className="w-full px-1 pt-2 pb-3 flex" style={style}>
			<div
				className="w-full px-6 py-2 gap-1 flex items-center rounded-full cursor-pointer justify-center text-xs"
				style={{ backgroundColor: active ? "#3C3C3C" : "inherit" }}
				onClick={handleClick}
			>
				{children} {text}
			</div>
		</Link>
	);
}

export function useMenuProps(props: Props) {
	const active = useIsActive(props);
	const linkProps = useLinkProps(props);

	const color = active ? "#7DFA86" : "#FFFFFF80";

	return {
		...props,
		active,
		text: active && props.text,
		style: { fill: color, stroke: color, color },
		linkProps,
	};
}
