"use client";

import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";

type Props = {
	title: string;
};

export const SimpleHeader = ({ title }: Props) => {
	return (
		<div
			className="text-lg"
			onClick={() => {
				trackHandler(analyticsKeys.ui.header.click.simple);
			}}
		>
			{title}
		</div>
	);
};
