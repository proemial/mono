import github from "@/app/images/github.svg";
import google from "@/app/images/google.svg";
import twitter from "@/app/images/twitter.svg";
import x from "@/app/images/x.svg";
import { cn } from "@proemial/shadcn-ui";
import Image from "next/image";
import React from "react";

const logos = { google, twitter, github, x };

type Props = {
	variant: keyof typeof logos;
	className?: string;
};

export function SoMeLogo({ variant, className }: Props) {
	return (
		<Image className={cn("w-4 h-4", className)} src={logos[variant]} alt="" />
	);
}
