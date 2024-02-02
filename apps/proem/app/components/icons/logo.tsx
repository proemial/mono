import Image from "next/image";
import proem from "@/app/images/logo.png";
import google from "@/app/images/google.svg";
import twitter from "@/app/images/twitter.svg";
import github from "@/app/images/github.svg";
import { cn } from "@/app/components/shadcn-ui/utils";
import React from "react";

const logos = { proem, google, twitter, github };

type Props = {
  variant?: keyof typeof logos;
  className?: string;
};

export function Logo({ variant = "proem", className }: Props) {
  return (
    <Image className={cn("w-4 h-4", className)} src={logos[variant]} alt="" />
  );
}

export function ProemLogo() {
  return (
    <svg
      width="64"
      height="97"
      viewBox="0 0 64 97"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.10352e-05 0.666694C6.10352e-05 0.298489 0.29855 0 0.666756 0H32.004V32.0039H0.666755C0.29855 32.0039 6.10352e-05 31.7054 6.10352e-05 31.3372V0.666694Z"
        fill="#7DFA86"
      />
      <rect
        x="6.10352e-05"
        y="64.0071"
        width="32.0039"
        height="32.0039"
        rx="0.666695"
        fill="#7DFA86"
      />
      <path
        d="M31.996 0H63.3333C63.7015 0 64 0.298489 64 0.666695V32.0039H31.996V0Z"
        fill="#7DFA86"
      />
      <path
        d="M31.996 32.0045H64V63.3417C64 63.7099 63.7015 64.0084 63.3333 64.0084H32.6627C32.2945 64.0084 31.996 63.7099 31.996 63.3417V32.0045Z"
        fill="#7DFA86"
      />
    </svg>
  );
}
