"use client";
import { analyticsKeys } from "@/components/analytics/tracking/tracking-keys";
import { Tracker } from "@/components/analytics/tracking/tracker";
import { ProemLogo } from "@/components/icons/brand/logo";
import Link from "next/link";
import { ReactNode } from "react";
import { screenMaxWidth } from "../constants";

type PageHeaderProps = {
	title?: string;
	action?: ReactNode;
};

export function PageHeader({
	title = "Proem",
	action = <></>,
}: PageHeaderProps) {
	return (
		<div className="fixed top-0 z-50 w-full bg-black shadow-bottom">
			<PageHeaderUnfixed title={title} action={action} />
		</div>
	);
}

export function PageHeaderUnfixed({
	title = "Proem",
	action = <></>,
}: PageHeaderProps) {
	const handleClick = () => {
		Tracker.track(analyticsKeys.ui.header.click.logo);
	};

	return (
		<div
			className={`${screenMaxWidth} flex flex-row items-center justify-between px-4 pt-3 mx-auto`}
		>
			<Link href="/" onClick={handleClick}>
				<div className="flex flex-row gap-4">
					<ProemLogo size="sm" />
					<span className="text-[16px] font-normal">{title}</span>
				</div>
			</Link>
			{action}
		</div>
	);
}
