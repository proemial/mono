"use client";
import { useUser } from "@clerk/nextjs";
import { useDrawerState } from "@/app/components/login/state";

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
  onClick: (concept: string) => void,
): React.ReactNode {
  const re = /\(\(.*?\)\)/gi;

  const asLink = (input: string) => {
    const sanitized = input.replace("((", "").replace("))", "");

    return (
      <span
        className="underline cursor-pointer text-primary font-medium"
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

const style =
  "inline-block mb-4 rounded-b-2xl py-2 px-4 shadow bg-gradient-to-r";

export function Answer({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${style} bg-[#60A040] rounded-tr-2xl self-start`}>
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
  const { user } = useUser();
  const { open } = useDrawerState();

  const handleClick = () => {
    if (!user) {
      open();
      return;
    }
    onClick && onClick();
  };

  return (
    <div
      className={`${className} ${style} from-primary to-primary-gradient rounded-tr-2xl self-start`}
      onClick={handleClick}
    >
      {children}
    </div>
  );
}
