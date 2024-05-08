"use client";

import { Field } from "@/app/data/oa-fields";
import {
	analyticsKeys,
	trackHandler,
} from "@/components/analytics/tracking/tracking-keys";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { ReactNode } from "react";

dayjs.extend(relativeTime);

type Props = {
	id: string;
	date: string;
	field: Field | undefined;
	children: ReactNode;
};

export const FeedItemCard = ({ id, date, field, children }: Props) => {
	return (
		<Link
			href={`/paper/oa/${id}`}
			onClick={trackHandler(analyticsKeys.feed.click.card)}
		>
			<div className="space-y-3">
				<div className="flex items-center justify-between gap-2">
					{field ? (
						<div className="flex items-center gap-2">
							{field.icon}
							<div className="text-xs uppercase line-clamp-1">
								{field.displayName}
							</div>
						</div>
					) : (
						<div />
					)}
					<div className="uppercase text-2xs">{dayjs(date).fromNow()}</div>
				</div>
				{children}
			</div>
		</Link>
	);
};
