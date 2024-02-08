import Image from "next/image";
import google from "@/app/images/google.svg";
import twitter from "@/app/images/twitter.svg";
import github from "@/app/images/github.svg";
import { cn } from "@/app/components/shadcn-ui/utils";
import React from "react";

const logos = { google, twitter, github };

type Props = {
  variant: keyof typeof logos;
  className?: string;
};

export function Logo({ variant, className }: Props) {
  return (
    <Image className={cn("w-4 h-4", className)} src={logos[variant]} alt="" />
  );
}
