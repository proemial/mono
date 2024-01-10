"use client";
import { useDrawerState } from "@/app/components/login/state";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";

type Role = "function" | "data" | "system" | "user" | "assistant" | "tool";

type Props = {
  role: Role;
  content: string;
  explain: (msg: string) => void;
};

export function Message({ role, content, explain }: Props) {
  const withLinks = applyExplainLinks(content, explain);
  if (role === "user") {
    return <Question>{content}</Question>;
  } else {
    return <Answer>{withLinks}</Answer>;
  }
}

function applyExplainLinks(
  msg: string,
  onClick: (concept: string) => void
): React.ReactNode {
  const re = /\(\(.*?\)\)/gi;

  const asLink = (input: string) => {
    const sanitized = input.replace("((", "").replace("))", "");

    return (
      <span
        className="font-normal underline text-[#7DFA86] cursor-pointer"
        onClick={() => onClick(sanitized)}
      >
        {sanitized}
      </span>
    );
  };

  const arr = msg.replace(re, "~~$&~~").split("~~");
  return arr.map((s, i) => (
    <span key={i}>
      {s.match(re) ? <span>{s.match(re) ? asLink(s) : s}</span> : s}
    </span>
  ));
}

const style = "inline-block";

export function Answer({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${style} bg-[#464545] max-w-md leading-snug mb-2 py-2 px-4 text-[16px] font-sans font-normal rounded-sm self-start`}
    >
      {children}
    </div>
  );
}

type QuestionProps = {
  children: string;
  onClick?: () => void;
  className?: string;
};

export function Question({ children, onClick, className }: QuestionProps) {
  const { userId } = useAuth();
  const { open } = useDrawerState();

  const handleClick = () => {
    if (!userId) {
      open();
      return;
    }
    onClick && onClick();
  };

  return (
    <div className="bg-[#2F2F2F] flex flex-col leading-snug gap-3 mb-2 py-4 px-4 rounded-sm border border-[#3C3C3C] self-end">
      {/* <div className="flex flex-row items-center gap-3">
        <Image src="/avatars/sara.png" alt="picture" width="38" height="38" />
        <div className="flex flex-col">
          <p className="text-white text-[16px] font-sans font-normal">
            Sara Doyle
          </p>
          <p className="text-white/50 text-[16px] font-sans font-normal">
            AI Researcher @ MBU
          </p>
        </div>
      </div> */}
      <div
        className={`${className} ${style} bg-[#2F2F2F] flex flex-row leading-snug text-[16px] font-sans font-normal text-left self-end`}
        onClick={handleClick}
      >
        {children}
      </div>
    </div>
  );
}
