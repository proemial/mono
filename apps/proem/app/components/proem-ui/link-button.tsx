"use client";
import { Tracker } from "@/app/components/analytics/tracker";
import { Send } from "@/app/components/icons/functional/send";
import { Button } from "@/app/components/shadcn-ui/button";
import { cn } from "@/app/components/shadcn-ui/utils";
import { VariantProps, cva } from "class-variance-authority";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useFeatureFlags } from "../feature-flags/client-flags";
import { Features } from "../feature-flags/features";

type LinkProps = VariantProps<typeof variants> & {
	children: string;
	className?: string;
	href: string;
	track?: string;
};

const variants = cva("rounded-sm", {
	variants: {
		variant: {
			default: "bg-green-500 text-black text-center",
			starter:
				"bg-[#2F2F2F] text-white flex justify-between items-center border border-[#4E4E4E]",
		},
		size: {
			default: "text-[16px] font-normal py-2 px-4",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "default",
	},
});

export function LinkButton(props: LinkProps) {
	const { children, href, variant, size, className, track } = props;

	return (
		<Link
			href={href}
			className={`${cn(variants({ variant, size, className }))}`}
			onClick={() => track && Tracker.track(track)}
		>
			<div className="w-full mr-2 truncate">{children}</div>
			{variant === "starter" && <Send />}
		</Link>
	);
}

type ButtonProps = VariantProps<typeof variants> & {
	children: string;
	className?: string;
	onClick: () => void;
};
export function StarterButton(props: ButtonProps) {
	const { children, onClick, variant, size, className } = props;

	const container = useRef<HTMLDivElement>(null);
	const child = useRef<HTMLDivElement>(null);
	const [isMarquee, setIsMarquee] = useState(false);

	const flags = useFeatureFlags(["animateAskStarters"]);

	useEffect(() => {
		if (flags.animateAskStarters && container.current && child.current) {
			if (container.current.clientWidth < child.current.clientWidth) {
				setIsMarquee(true);
				child.current.classList.add("animate-marquee");
			}
		}
	}, [container.current, child.current, flags]);

	const containerStyles = flags.animateAskStarters ? "" : "flex";
	const childStyles = flags.animateAskStarters ? "text-nowrap" : "";

	return (
		<Button
			onClick={onClick}
			className={cn(
				variants({ variant, size, className }),
				"text-left h-[unset]",
			)}
		>
			<div
				ref={container}
				className={`w-full mr-2 overflow-hidden ${containerStyles}`}
			>
				<div
					ref={child}
					className={`inline-block overflow-hidden ${childStyles}`}
					style={{ animationDelay: "1s" }}
				>
					{!isMarquee && <p className="inline-block">{children}</p>}
					{isMarquee && (
						<>
							<p className="inline-block pr-4">{children}</p>
							<p className="inline-block pr-4">{children}</p>
						</>
					)}
				</div>
			</div>
			<Send />
		</Button>
	);
}
